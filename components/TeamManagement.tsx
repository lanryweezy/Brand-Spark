import React, { useState } from 'react';
import PageTitle from './ui/PageTitle';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { User, Role } from '../types';
import { PlusIcon, TrashIcon, UserGroupIcon } from '../constants';
import { FixedSizeList as List } from 'react-window';

const InviteUserModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addUser } = useUsers();
    const { addToast } = useToast();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<Role>(Role.Member);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addUser({ name, email, role });
            addToast(`Invitation sent to ${email}`, 'success');
            onClose();
        } catch (error) {
            addToast('Failed to invite user.', 'error');
        }
    };

    return (
        <Modal title="Invite New Team Member" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="name" label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                <Input id="email" type="email" label="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                <Select id="role" label="Role" value={role} onChange={e => setRole(e.target.value as Role)}>
                    <option value={Role.Admin}>Admin</option>
                    <option value={Role.Member}>Member</option>
                </Select>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Send Invitation</Button>
                </div>
            </form>
        </Modal>
    );
};

import { memo, CSSProperties } from 'react';
import { areEqual } from 'react-window';

interface RowProps {
    index: number;
    style: CSSProperties;
    data: {
        users: User[];
        isAdmin: boolean;
        currentUser: User | null;
        handleRoleChange: (userId: string, newRole: Role) => void;
        handleDeleteUser: (user: User) => void;
    };
}

const Row = memo(({ index, style, data }: RowProps) => {
    const { users, isAdmin, currentUser, handleRoleChange, handleDeleteUser } = data;
    const user = users[index];
    return (
        <div style={style} className="flex border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 items-center">
            <div className="px-6 py-4 whitespace-nowrap flex-1">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-brand-text dark:text-slate-200">{user.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                    </div>
                </div>
            </div>
            <div className="px-6 py-4 whitespace-nowrap w-48">
                {isAdmin ? (
                    <Select
                        label=""
                        id={`role-${user.id}`}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                        disabled={user.id === currentUser?.id}
                        className="w-40 text-sm"
                    >
                        <option value={Role.Admin}>Admin</option>
                        <option value={Role.Member}>Member</option>
                    </Select>
                ) : (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === Role.Admin ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'}`}>
                        {user.role}
                    </span>
                )}
            </div>
            {isAdmin && (
                <div className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-24">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        disabled={user.id === currentUser?.id}
                    >
                        <TrashIcon className="w-5 h-5 text-slate-500 hover:text-red-600" />
                    </Button>
                </div>
            )}
        </div>
    );
}, areEqual);

const TeamManagement: React.FC = () => {
    const { users, updateUser, deleteUser } = useUsers();
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isAdmin = currentUser?.role === Role.Admin;

    const handleRoleChange = (userId: string, newRole: Role) => {
        updateUser(userId, { role: newRole });
        addToast("User role updated.", "success");
    };

    const handleDeleteUser = (user: User) => {
        if (user.id === currentUser?.id) {
            addToast("You cannot remove yourself.", "error");
            return;
        }
        if (window.confirm(`Are you sure you want to remove ${user.name} from the team?`)) {
            deleteUser(user.id);
            addToast(`${user.name} has been removed.`, "info");
        }
    };

    return (
        <div>
            <PageTitle
                title="Team Management"
                subtitle="Invite and manage your agency's team members."
                actions={
                    isAdmin && (
                        <Button onClick={() => setIsModalOpen(true)}>
                            <PlusIcon className="mr-2" /> Invite Member
                        </Button>
                    )
                }
            />
            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto min-w-[600px]">
                    <div className="flex bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <div className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex-1">Name</div>
                        <div className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider w-48">Role</div>
                        {isAdmin && <div className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider w-24">Actions</div>}
                    </div>
                    <List
                        height={600}
                        itemCount={users.length}
                        itemSize={80}
                        width="100%"
                        className="sidebar-nav-scroll"
                        itemData={{ users, isAdmin, currentUser, handleRoleChange, handleDeleteUser }}
                    >
                        {Row as any}
                    </List>
                </div>
            </Card>
            {isModalOpen && <InviteUserModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default TeamManagement;

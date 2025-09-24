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
            <Card className="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-brand-text">{user.name}</div>
                                                <div className="text-sm text-slate-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
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
                                    </td>
                                    {isAdmin && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteUser(user)}
                                                disabled={user.id === currentUser?.id}
                                            >
                                                <TrashIcon className="w-5 h-5 text-slate-500 hover:text-red-600" />
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {isModalOpen && <InviteUserModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default TeamManagement;

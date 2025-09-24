

import React from 'react';

export const SparklesIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18l-1.813-2.096a4.5 4.5 0 00-6.364-6.364l-2.096-1.813L3 6l2.096 1.813a4.5 4.5 0 006.364 6.364zm-1.12-2.828a4.5 4.5 0 00-6.364-6.364L3 6m6.813 9.904L9 18l2.096-1.813a4.5 4.5 0 006.364-6.364L15 6m-2.096 1.813a4.5 4.5 0 006.364 6.364L15 18l-1.813-2.096-6.364-6.364 1.813-2.096L12 3l-2.096 1.813a4.5 4.5 0 00-6.364 6.364l2.096 1.813z" />
  </svg>
);

export const LayoutDashboardIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <rect width="7" height="9" x="3" y="3" rx="1"></rect>
    <rect width="7" height="5" x="14" y="3"rx="1"></rect>
    <rect width="7" height="9" x="14" y="12" rx="1"></rect>
    <rect width="7" height="5" x="3" y="16" rx="1"></rect>
  </svg>
);

export const ClipboardCopyIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

export const CheckIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

export const CogIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const TrashIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.716c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const PencilIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

export const PlusIcon: React.FC<{className?: string}> = ({className="w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const XIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const BuildingStorefrontIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H4.5A2.25 2.25 0 002.25 13.5V21M3 3h12M3 3v2.25M3 3l1.875 1.875M16.5 3h.008v.008h-.008V3zM19.5 3h.008v.008h-.008V3zM21 3h.008v.008h-.008V3zM21 6h.008v.008h-.008V6zM21 9h.008v.008h-.008V9zM21 12h.008v.008h-.008V12zM16.5 6h.008v.008h-.008V6zM19.5 6h.008v.008h-.008V6zM16.5 9h.008v.008h-.008V9zM19.5 9h.008v.008h-.008V9zM16.5 12h.008v.008h-.008V12zM19.5 12h.008v.008h-.008V12zM4.5 21h6.75c.621 0 1.125-.504 1.125-1.125V13.5A2.25 2.25 0 0011.25 11.25H4.5A2.25 2.25 0 002.25 13.5v6.375c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);

export const CalendarDaysIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008zM12 15.75h.008v.008H12v-.008zM9.75 12.75h.008v.008H9.75v-.008zM9.75 15.75h.008v.008H9.75v-.008zM7.5 12.75h.008v.008H7.5v-.008zM7.5 15.75h.008v.008H7.5v-.008zM14.25 12.75h.008v.008H14.25v-.008zM14.25 15.75h.008v.008H14.25v-.008zM16.5 12.75h.008v.008H16.5v-.008zM16.5 15.75h.008v.008H16.5v-.008z" />
    </svg>
);

export const EnvelopeIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

export const KeyIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
);

export const MegaphoneIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 12h-3a7.5 7.5 0 00-7.5-7.5h1.5m9-4.5h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM15 9.75h.008v.008H15V9.75zm0 2.25h.008v.008H15v-.008zM15 15h.008v.008H15V15zm-4.5-3.75h.008v.008h-.008v-.008z" />
    </svg>
);

export const LightBulbIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a6.01 6.01 0 00-3.75 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const CalendarPlusIcon: React.FC<{className?: string}> = ({className="w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const TwitterIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.39.106-.803.163-1.227.163-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></svg>
);

export const InstagramIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.117 0-3.483.011-4.71.069-2.76.126-3.955 1.31-4.082 4.082-.057 1.227-.069 1.592-.069 4.71s.012 3.483.069 4.71c.127 2.772 1.322 3.955 4.082 4.082 1.227.057 1.592.069 4.71.069s3.483-.011 4.71-.069c2.76-.126 3.955-1.31 4.082-4.082.057-1.227.069-1.592.069-4.71s-.012-3.483-.069-4.71c-.127-2.772-1.322-3.955-4.082-4.082C15.483 3.614 15.117 3.604 12 3.604z"></path><path d="M12 6.873c-2.849 0-5.127 2.278-5.127 5.127s2.278 5.127 5.127 5.127 5.127-2.278 5.127-5.127S14.849 6.873 12 6.873zm0 8.812c-2.029 0-3.685-1.657-3.685-3.685s1.657-3.685 3.685-3.685 3.685 1.657 3.685 3.685-1.656 3.685-3.685 3.685z"></path><path d="M16.965 6.577a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z"></path>
    </svg>
);

export const FacebookIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
    </svg>
);

export const LinkedInIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
    </svg>
);

export const ChartBarIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 21v-7.875zM12.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v12.375c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM21 4.125C21 3.504 21.504 3 22.125 3h.25c.621 0 1.125.504 1.125 1.125v16.75c0 .621-.504 1.125-1.125 1.125h-.25A1.125 1.125 0 0121 21V4.125z" />
    </svg>
);

export const LinkIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
);

export const GlobeAltIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-.354-17.958M12 21V3m0 18c-2.863 0-5.52-1.116-7.464-2.964m14.928 0A8.962 8.962 0 0112 21zM2.536 9.036A8.963 8.963 0 0112 3c2.863 0 5.52 1.116 7.464 2.964m-14.928 0zM21.464 14.964A8.962 8.962 0 0112 21.001c-2.863 0-5.52-1.116-7.464-2.964m14.928 0a8.962 8.962 0 01-.001-5.928z" />
    </svg>
);

export const RocketLaunchIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.95 14.95 0 00-11.23-1.63m11.23 1.63v4.82m-3.08-3.08a6 6 0 00-7.38-5.84m-2.56 5.84v-4.82m7.38 3.08l-3.08-3.08m0 0a14.953 14.953 0 01-1.63-11.23m1.63 11.23L4.37 15.59m7.38-7.38L9.63 5.18m2.56-.25L14.37 2.41m-2.56.25a14.937 14.937 0 01-1.63 11.23m-1.63-11.23L5.18 9.63m7.38 7.38l3.08 3.08m-3.08-3.08L18.82 9.63m-7.38-7.38l-3.08-3.08A14.953 14.953 0 019.63 2.18z" />
    </svg>
);

export const UserGroupIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 00-12 0m12 0a9.094 9.094 0 01-12 0m12 0v-4.5m-12 4.5v-4.5m12 0a9.094 9.094 0 00-12 0m12 0a9.094 9.094 0 01-12 0m12 0v-4.5m-12 4.5v-4.5m12 0a9.094 9.094 0 00-12 0m12 0a9.094 9.094 0 01-12 0M12 3a9.094 9.094 0 00-9 9.094 9.094 9.094 0 009 9.094 9.094 9.094 0 009-9.094A9.094 9.094 0 0012 3z" />
    </svg>
);

export const CpuChipIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3.75H19.5M8.25 3.75V19.5M8.25 3.75H3.75m15.75 0v15.75M3.75 19.5h15.75M3.75 19.5v-2.25M19.5 19.5v-2.25m-10.5-6.375a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 12.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zM13.5 11.25a.375.375 0 11-.75 0 .375.375 0 01.75 0zM15 12.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zM16.5 11.25a.375.375 0 11-.75 0 .375.375 0 01.75 0zM18 12.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zM9.75 15.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zM11.25 14.25a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12.75 15.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zM14.25 14.25a.375.375 0 11-.75 0 .375.375 0 01.75 0zM15.75 15.75a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

export const ShareIcon: React.FC<{className?: string}> = ({className="w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.19.023.374.05.558.083m-1.527.062c-.226.043-.442.096-.646.156M12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm0 0c.19.023.374.05.558.083m-1.527.062c-.226.043-.442.096-.646.156M16.783 15.193a2.25 2.25 0 100-2.186m0 2.186c-.19-.023-.374-.05-.558-.083m1.527.062c.226.043.442.096.646.156M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);

export const TagIcon: React.FC<{className?: string}> = ({className="w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);

export const ChevronDownIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

export const ChevronDoubleLeftIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
    </svg>
);

export const ChevronDoubleRightIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
    </svg>
);

export const FolderIcon: React.FC<{className?: string}> = ({className="w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
);

export const CheckBadgeIcon: React.FC<{className?: string}> = ({className="w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const GoogleAdsIcon: React.FC<{className?: string}> = ({className="w-8 h-8"}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.125 10.375L6 12L10.125 13.625L12 18V6L10.125 10.375Z" fill="#4285F4"/>
        <path d="M13.875 10.375L18 12L13.875 13.625L12 18V6L13.875 10.375Z" fill="#FBBC04"/>
    </svg>
);

export const PaperAirplaneIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

export const BriefcaseIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.05a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25v-4.05m16.5 0v-3.875a2.25 2.25 0 00-2.25-2.25h-12a2.25 2.25 0 00-2.25 2.25v3.875m16.5 0h-16.5" />
    </svg>
);

export const DocumentArrowDownIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
);

export const CurrencyDollarIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.553-.44 1.28-.659 2.003-.659s1.45.22 2.003.659l.879.659m0-3.182v-1.14" />
    </svg>
);

export const MailchimpIcon: React.FC<{className?: string}> = ({className="w-8 h-8 text-slate-800"}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M7.4,18.3c-0.5,0.4-1.2,0.6-1.8,0.6c-1.3,0-2.3-0.8-2.3-2.3c0-1.2,0.8-2,2-2.3c0.4-0.1,0.8-0.1,1.2,0 c0.2,0,0.4,0,0.5,0.1c0.3,0.1,0.5,0.1,0.7,0.1c0.5,0,1-0.2,1.3-0.5c0.4-0.4,0.6-0.9,0.5-1.5c-0.1-0.8-0.8-1.5-1.6-1.6 c-0.5-0.1-1,0-1.5,0.3c-0.5,0.4-1.1,0.8-1.8,0.6c-0.5-0.1-0.9-0.5-1-1c-0.1-0.4,0.1-0.9,0.5-1.2c0.7-0.6,1.6-1,2.5-1.1 c1.8-0.2,3.5,0.8,4.2,2.4c0.5,1.1,0.4,2.4-0.3,3.4C10.7,17.2,9.2,18.4,7.4,18.3z M18.4,14.4c-0.1,0.4-0.5,0.7-1,0.6 c-0.4-0.1-0.7-0.5-0.6-1c0-0.1,0-0.1,0-0.2c0-0.4,0-0.8-0.1-1.2c-0.1-0.6-0.3-1.1-0.6-1.6c-0.8-1.2-2.1-1.9-3.5-1.7 c-0.5,0.1-1,0.3-1.4,0.6c-0.4,0.3-0.5,0.8-0.3,1.2c0.2,0.4,0.8,0.5,1.2,0.3c0.2-0.1,0.4-0.3,0.6-0.4c0.5-0.3,1.1-0.4,1.7-0.1 c0.8,0.3,1.3,1.1,1.3,2c0,0.4,0,0.8,0.1,1.2c0.1,0.6,0.3,1.1,0.6,1.6c0.8,1.2,2.1,1.9,3.5,1.7c0.5-0.1,1-0.3,1.4-0.6 c0.4-0.3,0.5-0.8,0.3-1.2C18.9,14.8,18.7,14.5,18.4,14.4z M17.6,10.6c0-0.1,0.1-0.3,0.1-0.4c0-0.3-0.1-0.6-0.2-0.8 c-0.4-0.6-1-1-1.7-1.1c-1-0.1-1.9,0.4-2.4,1.2c-0.4,0.6-0.5,1.4-0.3,2.1c0.1,0.5,0.4,0.9,0.9,1.1c0.4,0.2,0.9,0.1,1.2-0.2 c0.3-0.3,0.4-0.8,0.2-1.2c-0.1-0.3-0.3-0.5-0.6-0.6C15,10.9,15.1,10.7,15,10.6c0.1-0.1,0.3,0,0.4,0c0.3,0,0.6,0.2,0.7,0.4 c0.2,0.3,0.3,0.7,0.1,1c-0.1,0.2-0.3,0.4-0.5,0.5c0,0,0,0,0,0c0.4,0.2,0.8,0,1.1-0.3c0.4-0.5,0.6-1,0.5-1.6 C17.3,10.9,17.4,10.7,17.6,10.6z"></path></svg>
);

export const SalesforceIcon: React.FC<{className?: string}> = ({className="w-8 h-8 text-[#00A1E0]"}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11.35,16.29a3.24,3.24,0,0,1-2.22-1.3,3.24,3.24,0,0,1-1.3-2.22A3.33,3.33,0,0,1,8,11a3.24,3.24,0,0,1,1.3-2.22,3.24,3.24,0,0,1,2.22-1.3,3.33,3.33,0,0,1,1.82.16,3.24,3.24,0,0,1,2.22,1.3,3.24,3.24,0,0,1,1.3,2.22,3.33,3.33,0,0,1-.16,1.82,3.24,3.24,0,0,1-1.3,2.22,3.24,3.24,0,0,1-2.22,1.3A3.33,3.33,0,0,1,11.35,16.29Zm4-10.45a.55.55,0,0,0-.61,0L13.2,7.39a.57.57,0,0,0,0,.62L14.77,9.5a.55.55,0,0,0,.61,0l1.53-1.54a.57.57,0,0,0,0-.62Zm-8,12.32a.55.55,0,0,0-.61,0L5.2,19.7a.57.57,0,0,0,0,.62l1.54,1.53a.55.55,0,0,0,.61,0l1.53-1.53a.57.57,0,0,0,0-.62Z"></path></svg>
);

export const SlackIcon: React.FC<{className?: string}> = ({className="w-8 h-8"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 54 54">
        <path d="M14.21 21.89a4.29 4.29 0 0 1-4.29-4.29V14.2a4.29 4.29 0 0 1 4.29-4.29h3.41a4.29 4.29 0 0 1 4.29 4.29v3.41a4.29 4.29 0 0 1-4.29 4.29h-3.41Z" fill="#36C5F0"></path>
        <path d="M17.62 39.79A4.29 4.29 0 0 1 13.33 35.5h-3.4a4.29 4.29 0 0 1-4.29-4.29v-3.4a4.29 4.29 0 0 1 4.29-4.29h3.4a4.29 4.29 0 0 1 4.29 4.29v3.4a4.29 4.29 0 0 1-4.29 4.29Z" fill="#2EB67D"></path>
        <path d="M21.89 39.79a4.29 4.29 0 0 1 4.29 4.29h3.4a4.29 4.29 0 0 1 4.29 4.29v3.4a4.29 4.29 0 0 1-4.29 4.29h-3.4a4.29 4.29 0 0 1-4.29-4.29v-3.4a4.29 4.29 0 0 1 4.29-4.29Z" transform="rotate(-90 28.185 41.985)" fill="#ECB22E"></path>
        <path d="M39.79 36.38a4.29 4.29 0 0 1 4.29-4.29h3.4a4.29 4.29 0 0 1 4.29 4.29v3.4a4.29 4.29 0 0 1-4.29 4.29h-3.4a4.29 4.29 0 0 1-4.29-4.29v-3.4Z" transform="rotate(180 44.085 36.38)" fill="#E01E5A"></path>
    </svg>
);

export const HootsuiteIcon: React.FC<{className?: string}> = ({className="w-8 h-8 text-gray-800"}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.71 9.71a1 1 0 0 1-1.42 0 1 1 0 0 0-1.41 0 1 1 0 0 1-1.42 0 3 3 0 0 0-4.24 0 1 1 0 0 1-1.42 0 1 1 0 0 0-1.41 0 1 1 0 0 1-1.42-1.42 3 3 0 0 0 0-4.24 1 1 0 0 1 0-1.42 1 1 0 0 0 0-1.41 1 1 0 0 1 1.42-1.42 3 3 0 0 0 4.24 0 1 1 0 0 1 1.42 0 1 1 0 0 0 1.41 0 1 1 0 0 1 1.42 1.42 3 3 0 0 0 0 4.24 1 1 0 0 1 0 1.42 1 1 0 0 0 0 1.41A1 1 0 0 1 15.71 11.71Z"></path><path d="M12 14.5a2.5 2.5 0 1 0-2.5-2.5A2.5 2.5 0 0 0 12 14.5Z"></path></svg>
);

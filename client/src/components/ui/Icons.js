import React from 'react';

const BaseIcon = ({
  size = 20,
  strokeWidth = 1.9,
  className = '',
  children,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

export const SearchIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.6-3.6" />
  </BaseIcon>
);

export const HomeIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5.5 9.5V20h13V9.5" />
    <path d="M10 20v-5.5h4V20" />
  </BaseIcon>
);

export const UsersIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M16.5 21v-1.5A3.5 3.5 0 0 0 13 16h-2a3.5 3.5 0 0 0-3.5 3.5V21" />
    <circle cx="12" cy="9" r="3.5" />
    <path d="M7 8.5A3.5 3.5 0 0 0 4 12" />
    <path d="M17 8.5A3.5 3.5 0 0 1 20 12" />
  </BaseIcon>
);

export const MessageIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H10l-4.5 4v-4H7.5A2.5 2.5 0 0 1 5 12.5z" />
  </BaseIcon>
);

export const BellIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M6.5 9.5a5.5 5.5 0 1 1 11 0V14l1.5 2.5H5L6.5 14z" />
    <path d="M10 18a2 2 0 0 0 4 0" />
  </BaseIcon>
);

export const SunIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="3.75" />
    <path d="M12 2.5v2.25" />
    <path d="M12 19.25v2.25" />
    <path d="m4.93 4.93 1.6 1.6" />
    <path d="m17.47 17.47 1.6 1.6" />
    <path d="M2.5 12h2.25" />
    <path d="M19.25 12h2.25" />
    <path d="m4.93 19.07 1.6-1.6" />
    <path d="m17.47 6.53 1.6-1.6" />
  </BaseIcon>
);

export const MoonIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M20 14.2A7.5 7.5 0 1 1 9.8 4 6.25 6.25 0 0 0 20 14.2Z" />
  </BaseIcon>
);

export const LogoutIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M10 7V5.5A2.5 2.5 0 0 1 12.5 3H18a2.5 2.5 0 0 1 2.5 2.5v13A2.5 2.5 0 0 1 18 21h-5.5A2.5 2.5 0 0 1 10 18.5V17" />
    <path d="M4 12h10" />
    <path d="m7.5 8.5-3.5 3.5 3.5 3.5" />
  </BaseIcon>
);

export const PlusIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </BaseIcon>
);

export const ImageIcon = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <circle cx="9" cy="10" r="1.5" />
    <path d="m21 15-4.5-4.5L8 19" />
  </BaseIcon>
);

export const SparkIcon = (props) => (
  <BaseIcon {...props}>
    <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z" />
  </BaseIcon>
);

export const GlobeIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.8 9.5h16.4" />
    <path d="M3.8 14.5h16.4" />
    <path d="M12 3.5c2.2 2.4 3.5 5.3 3.5 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.5-5.3-3.5-8.5S9.8 5.9 12 3.5Z" />
  </BaseIcon>
);

export const CompassIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m14.7 9.3-2.1 5.4-5.3 2.1 2.1-5.4z" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </BaseIcon>
);

export const LockIcon = (props) => (
  <BaseIcon {...props}>
    <rect x="5" y="11" width="14" height="10" rx="2.5" />
    <path d="M8.5 11V8.5a3.5 3.5 0 1 1 7 0V11" />
  </BaseIcon>
);

export const MoreIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="6" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="18" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </BaseIcon>
);

export const EditIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M12 20h8" />
    <path d="m15 4 5 5" />
    <path d="M4 16.5V20h3.5L18.5 9 15 5.5z" />
  </BaseIcon>
);

export const TrashIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M4 7h16" />
    <path d="m9 7 .5-2h5L15 7" />
    <path d="M7 7v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7" />
    <path d="M10 11v5" />
    <path d="M14 11v5" />
  </BaseIcon>
);

export const LikeIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M14 10V5.75A2.75 2.75 0 0 0 11.25 3L8 10v11h10.2a2 2 0 0 0 1.97-1.66l1.06-6.5A2.25 2.25 0 0 0 21 11H14Z" />
    <path d="M8 10H4.5A1.5 1.5 0 0 0 3 11.5v8A1.5 1.5 0 0 0 4.5 21H8" />
  </BaseIcon>
);

export const CommentIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M5.5 6A2.5 2.5 0 0 1 8 3.5h8A2.5 2.5 0 0 1 18.5 6v5A2.5 2.5 0 0 1 16 13.5H10L5.5 18v-4.5A2.5 2.5 0 0 1 3 11V6Z" />
  </BaseIcon>
);

export const ShareIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="18" cy="5.5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="18.5" r="2.5" />
    <path d="m8.25 10.85 7.5-3.7" />
    <path d="m8.25 13.15 7.5 3.7" />
  </BaseIcon>
);

export const CloseIcon = (props) => (
  <BaseIcon {...props}>
    <path d="m6 6 12 12" />
    <path d="M18 6 6 18" />
  </BaseIcon>
);

export const CameraIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M5 7.5h3l1.5-2h5L16 7.5h3A2.5 2.5 0 0 1 21.5 10v7A2.5 2.5 0 0 1 19 19.5H5A2.5 2.5 0 0 1 2.5 17v-7A2.5 2.5 0 0 1 5 7.5Z" />
    <circle cx="12" cy="13.5" r="3.5" />
  </BaseIcon>
);

export const MailIcon = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4.5 7.5 7.5 6 7.5-6" />
  </BaseIcon>
);

export const BriefcaseIcon = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="7" width="18" height="12" rx="2.5" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
    <path d="M3 12h18" />
  </BaseIcon>
);

export const HeartIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M12 20s-6.5-4.2-8.5-8.1C2 8.6 3.9 5 7.5 5c1.9 0 3.3.9 4.5 2.4C13.2 5.9 14.6 5 16.5 5 20.1 5 22 8.6 20.5 11.9 18.5 15.8 12 20 12 20Z" />
  </BaseIcon>
);

export const UserPlusIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="9" cy="8" r="3.25" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M18 8v6" />
    <path d="M15 11h6" />
  </BaseIcon>
);

export const CheckIcon = (props) => (
  <BaseIcon {...props}>
    <path d="m5 12 4.2 4.2L19 6.5" />
  </BaseIcon>
);

export const ClockIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5l3.25 1.75" />
  </BaseIcon>
);

export const SendIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M21 3 10.5 13.5" />
    <path d="M21 3 14.5 21l-4-7-7-4L21 3Z" />
  </BaseIcon>
);

export const RefreshIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M20 6v5h-5" />
    <path d="M4 18v-5h5" />
    <path d="M18 11a6.5 6.5 0 0 0-11-3.8L5 9" />
    <path d="M6 13a6.5 6.5 0 0 0 11 3.8L19 15" />
  </BaseIcon>
);

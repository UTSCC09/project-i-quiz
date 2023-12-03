function EllipsisIcon({ className }) {
  /* [Credit]: svg from https://heroicons.dev */
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
      />
    </svg>
  );
}

function ChevronIcon({ className }) {
  /* [Credit]: svg from https://heroicons.dev */
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
        stroke="currentColor"
        strokeWidth="1"
      ></path>
    </svg>
  );
}

function CheckIcon({ className }) {
  /* [Credit]: svg from https://codesandbox.io/p/sandbox/framer-motion-checkbox-animation-2cf2jn */
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

function XMarkIcon({ className }) {
  /* [Credit]: svg from https://heroicons.dev */
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
      ></path>
    </svg>
  );
}

function CheckCircleIcon({ className }) {
  /* [Credit]: svg from https://heroicons.dev */
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      ></path>
    </svg>
  );
}

function DiceIcon({ className }) {
  /* [Credit]: svg from https://www.flaticon.com/uicons */
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19,24H14a5.006,5.006,0,0,1-5-5V14a5.006,5.006,0,0,1,5-5h5a5.006,5.006,0,0,1,5,5v5A5.006,5.006,0,0,1,19,24ZM14,11a3,3,0,0,0-3,3v5a3,3,0,0,0,3,3h5a3,3,0,0,0,3-3V14a3,3,0,0,0-3-3Zm0,2a1,1,0,1,0,1,1A1,1,0,0,0,14,13Zm5,5a1,1,0,1,0,1,1A1,1,0,0,0,19,18ZM9,7A1,1,0,1,0,8,6,1,1,0,0,0,9,7ZM7,9a1,1,0,1,0-1,1A1,1,0,0,0,7,9Zm-.22,6.826a1,1,0,0,0-.154-1.405,3.15,3.15,0,0,1-.251-.228L2.864,10.634a3.005,3.005,0,0,1,.029-4.243L6.453,2.88a2.98,2.98,0,0,1,2.106-.864h.022a2.981,2.981,0,0,1,2.115.893L14.2,6.465c.057.058.111.117.163.179A1,1,0,1,0,15.9,5.356c-.083-.1-.17-.194-.266-.292L12.12,1.505a5,5,0,0,0-7.071-.049L1.489,4.967a5.007,5.007,0,0,0-.049,7.071L4.951,15.6a4.865,4.865,0,0,0,.423.381,1,1,0,0,0,1.406-.153Z" />
    </svg>
  );
}

function QuestionMarkCircleIcon({ className }) {
  /* [Credit]: svg from https://www.flaticon.com/uicons */
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      strokeWidth="0.5"
      stroke="currentColor"
    >
      <path d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z" />
      <path d="M12.717,5.063A4,4,0,0,0,8,9a1,1,0,0,0,2,0,2,2,0,0,1,2.371-1.967,2.024,2.024,0,0,1,1.6,1.595,2,2,0,0,1-1,2.125A3.954,3.954,0,0,0,11,14.257V15a1,1,0,0,0,2,0v-.743a1.982,1.982,0,0,1,.93-1.752,4,4,0,0,0-1.213-7.442Z" />
      <circle cx="12.005" cy="18" r="1" />
    </svg>
  );
}

function BellIcon({ className }) {
  /* [Credit]: svg from https://www.flaticon.com/uicons */
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 21 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M10.4997 0C8.11273 0 5.82355 0.948211 4.13572 2.63604C2.44789 4.32387 1.49968 6.61305 1.49968 9V14.379L0.43918 15.4395C0.229466 15.6493 0.0866566 15.9165 0.0288052 16.2075C-0.0290461 16.4984 0.000658426 16.7999 0.114163 17.074C0.227669 17.348 0.419878 17.5823 0.666493 17.7471C0.913107 17.9119 1.20305 17.9999 1.49968 18H19.4997C19.7963 17.9999 20.0863 17.9119 20.3329 17.7471C20.5795 17.5823 20.7717 17.348 20.8852 17.074C20.9987 16.7999 21.0284 16.4984 20.9706 16.2075C20.9127 15.9165 20.7699 15.6493 20.5602 15.4395L19.4997 14.379V9C19.4997 6.61305 18.5515 4.32387 16.8636 2.63604C15.1758 0.948211 12.8866 0 10.4997 0ZM10.4997 24C9.30621 24 8.16161 23.5259 7.3177 22.682C6.47379 21.8381 5.99968 20.6935 5.99968 19.5H14.9997C14.9997 20.6935 14.5256 21.8381 13.6817 22.682C12.8377 23.5259 11.6932 24 10.4997 24Z"
      ></path>
    </svg>
  );
}

function CogIcon({ className }) {
  /* [Credit]: svg from https://heroicons.dev */
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
      ></path>
    </svg>
  );
}

function AdjustmentsIcon({ className }) {
  /* [Credit]: svg from https://heroicons.dev */
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
      />
    </svg>
  );
}

function PlusIcon({ className }) {
  /* [Credit]: svg from https://heroicons.dev */
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
      />
    </svg>
  );
}

function FileEditIcon({ className }) {
  /* [Credit]: svg from https://www.flaticon.com/uicons */
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="m13,9c-1.105,0-2-.895-2-2V3h-5.5c-1.378,0-2.5,1.122-2.5,2.5v13c0,1.378,1.122,2.5,2.5,2.5h3c.829,0,1.5.671,1.5,1.5s-.671,1.5-1.5,1.5h-3c-3.033,0-5.5-2.467-5.5-5.5V5.5C0,2.467,2.467,0,5.5,0h6.343c1.469,0,2.85.572,3.889,1.611l2.657,2.657c1.039,1.039,1.611,2.419,1.611,3.889v1.343c0,.829-.671,1.5-1.5,1.5s-1.5-.671-1.5-1.5v-.5h-4Zm10.512,3.849c-.875-1.07-2.456-1.129-3.409-.176l-6.808,6.808c-.813.813-1.269,1.915-1.269,3.064v.955c0,.276.224.5.5.5h.955c1.149,0,2.252-.457,3.064-1.269l6.715-6.715c.85-.85,1.013-2.236.252-3.167Z" />
    </svg>
  );
}

function PenIcon({ className }) {
  /* [Credit]: svg from https://www.flaticon.com/uicons */
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M1.172,19.119A4,4,0,0,0,0,21.947V24H2.053a4,4,0,0,0,2.828-1.172L18.224,9.485,14.515,5.776Z" />
      <path d="M23.145.855a2.622,2.622,0,0,0-3.71,0L15.929,4.362l3.709,3.709,3.507-3.506A2.622,2.622,0,0,0,23.145.855Z" />
    </svg>
  );
}

export {
  EllipsisIcon,
  ChevronIcon,
  CheckIcon,
  XMarkIcon,
  CheckCircleIcon,
  DiceIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  CogIcon,
  AdjustmentsIcon,
  PlusIcon,
  FileEditIcon,
  PenIcon,
};

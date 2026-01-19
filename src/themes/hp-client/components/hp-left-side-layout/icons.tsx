import React from "react";

export const HpHomeIconOld = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const selectedPath =
    "M11.8355 3.62839C11.4256 3.66558 11.0319 3.82613 10.7217 4.08463C10.7045 4.09914 8.98112 5.81978 6.89132 7.90867C3.46638 11.3327 3.08996 11.7109 3.06185 11.7654C2.95572 11.9667 2.99291 12.1998 3.15527 12.3567C3.31309 12.5091 3.52443 12.5409 3.72851 12.4438C3.78203 12.4175 3.84098 12.3613 4.39246 11.8116L4.99835 11.2075L5.00108 15.1976C5.00289 18.9817 5.0038 19.193 5.01922 19.2837C5.05913 19.5141 5.11264 19.6874 5.20697 19.8787C5.31309 20.0955 5.44189 20.2724 5.61695 20.4411C5.94166 20.7522 6.35708 20.9445 6.79881 20.9889C6.86865 20.9962 7.42103 20.998 8.64461 20.9962C10.612 20.9926 10.4197 20.9998 10.5811 20.9209C10.7734 20.8257 10.9149 20.6533 10.9784 20.4356L10.9974 20.3676L11.0029 18.1C11.0074 16.0311 11.0092 15.8279 11.0228 15.7781C11.0791 15.5731 11.1489 15.4479 11.2841 15.3082C11.4782 15.1059 11.7203 15.0025 12.0006 15.0025C12.2809 15.0025 12.5231 15.1059 12.7172 15.3082C12.8523 15.4479 12.9222 15.5731 12.9784 15.7781C12.992 15.8279 12.9938 16.0302 12.9984 18.1C13.0038 20.666 12.9947 20.4003 13.08 20.5762C13.1562 20.7332 13.2641 20.8429 13.4201 20.92C13.5816 21.0007 13.3875 20.9935 15.4201 20.9935C17.1081 20.9935 17.226 20.9926 17.3113 20.9771C17.7412 20.9 18.0895 20.725 18.3897 20.4356C18.5612 20.2706 18.6881 20.0946 18.7943 19.8778C18.8877 19.6874 18.9421 19.5141 18.982 19.2837C18.9974 19.193 18.9984 18.9808 19.0002 15.1976L19.0029 11.2075L19.6088 11.8116C20.1603 12.3613 20.2192 12.4175 20.2727 12.4438C20.4813 12.5427 20.7018 12.5064 20.8559 12.3468C21.0111 12.1853 21.0419 11.9649 20.9376 11.7608C20.9067 11.7 20.6927 11.4842 17.2215 8.01116C15.1952 5.98395 13.4791 4.26966 13.4074 4.20254C13.1498 3.96037 12.9158 3.81796 12.6174 3.72C12.377 3.642 12.0768 3.60663 11.8355 3.62839Z";

  const unselectedPath =
    "M11.8355 3.62839C11.4256 3.66558 11.0319 3.82613 10.7217 4.08463C10.7045 4.09914 8.98112 5.81978 6.89132 7.90867C3.46638 11.3327 3.08996 11.7109 3.06185 11.7654C2.95572 11.9667 2.99291 12.1998 3.15527 12.3567C3.31309 12.5091 3.52443 12.5409 3.72851 12.4438C3.78203 12.4175 3.84098 12.3613 4.39246 11.8116L4.99835 11.2075L5.00108 15.1976C5.00289 18.9817 5.0038 19.193 5.01922 19.2837C5.05913 19.5141 5.11264 19.6874 5.20697 19.8787C5.31309 20.0955 5.44189 20.2724 5.61695 20.4411C5.94166 20.7522 6.35708 20.9445 6.79881 20.9889C6.86865 20.9962 7.42103 20.998 8.64461 20.9962C10.612 20.9926 10.4197 20.9998 10.5811 20.9209C10.7734 20.8257 10.9149 20.6533 10.9784 20.4356L10.9974 20.3676L11.0029 18.1C11.0074 16.0311 11.0092 15.8279 11.0228 15.7781C11.0791 15.5731 11.1489 15.4479 11.2841 15.3082C11.4782 15.1059 11.7203 15.0025 12.0006 15.0025C12.2809 15.0025 12.5231 15.1059 12.7172 15.3082C12.8523 15.4479 12.9222 15.5731 12.9784 15.7781C12.992 15.8279 12.9938 16.0302 12.9984 18.1C13.0038 20.666 12.9947 20.4003 13.08 20.5762C13.1562 20.7332 13.2641 20.8429 13.4201 20.92C13.5816 21.0007 13.3875 20.9935 15.4201 20.9935C17.1081 20.9935 17.226 20.9926 17.3113 20.9771C17.7412 20.9 18.0895 20.725 18.3897 20.4356C18.5612 20.2706 18.6881 20.0946 18.7943 19.8778C18.8877 19.6874 18.9421 19.5141 18.982 19.2837C18.9974 19.193 18.9984 18.9808 19.0002 15.1976L19.0029 11.2075L19.6088 11.8116C20.1603 12.3613 20.2192 12.4175 20.2727 12.4438C20.4813 12.5427 20.7018 12.5064 20.8559 12.3468C21.0111 12.1853 21.0419 11.9649 20.9376 11.7608C20.9067 11.7 20.6927 11.4842 17.2215 8.01116C15.1952 5.98395 13.4791 4.26966 13.4074 4.20254C13.1498 3.96037 12.9158 3.81796 12.6174 3.72C12.377 3.642 12.0768 3.60663 11.8355 3.62839ZM12.1902 4.64064C12.3253 4.66513 12.4777 4.73134 12.5965 4.81751C12.6256 4.83837 13.8546 6.06014 15.3276 7.53225L18.0052 10.2089V14.5989C18.0052 17.4642 18.0024 19.0225 17.9961 19.0851C17.9689 19.3753 17.8292 19.6257 17.597 19.8025C17.5172 19.8642 17.3575 19.9404 17.2478 19.9703L17.1571 19.9957H14.0006L13.9906 15.7508L13.9707 15.6511C13.8863 15.2175 13.6922 14.8565 13.3875 14.5626C13.0727 14.2597 12.6827 14.0719 12.2555 14.0184C12.0922 13.9976 11.8074 14.003 11.656 14.0302C11.2623 14.101 10.9022 14.2851 10.6147 14.5626C10.309 14.8565 10.1158 15.2175 10.0306 15.6511L10.0106 15.7508L10.0006 19.9957H6.84416L6.75527 19.9713C6.56752 19.9195 6.4106 19.8252 6.27545 19.6837C6.14575 19.5477 6.06502 19.3971 6.02058 19.2066L6.00062 19.125L5.99609 10.2089L8.67364 7.53225C10.1467 6.06014 11.3757 4.83837 11.4047 4.81751C11.5544 4.70867 11.7421 4.63973 11.9281 4.62341C11.9897 4.61796 12.1049 4.62522 12.1902 4.64064Z";

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={isSelected ? selectedPath : unselectedPath}
        fill={isSelected ? "#001CB0" : "#1A1A1A"}
      />
    </svg>
  );
};

export const HpHomeIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";
  const fillColor = isSelected ? "#001CB0" : undefined;

  if (isSelected) {
    // Filled icon when selected
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill={fillColor}
      >
        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
      </svg>
    );
  }

  // Outline icon when not selected
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
};

export const HpAIIcon = ({ isSelected = false }: { isSelected?: boolean }) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.18022 2.34439C9.21593 2.15323 9.31737 1.98057 9.46697 1.85632C9.61658 1.73208 9.80492 1.66406 9.99939 1.66406C10.1939 1.66406 10.3822 1.73208 10.5318 1.85632C10.6814 1.98057 10.7829 2.15323 10.8186 2.34439L11.6944 6.97606C11.7566 7.30535 11.9166 7.60824 12.1536 7.8452C12.3905 8.08216 12.6934 8.24219 13.0227 8.30439L17.6544 9.18022C17.8456 9.21593 18.0182 9.31737 18.1425 9.46697C18.2667 9.61658 18.3347 9.80492 18.3347 9.99939C18.3347 10.1939 18.2667 10.3822 18.1425 10.5318C18.0182 10.6814 17.8456 10.7829 17.6544 10.8186L13.0227 11.6944C12.6934 11.7566 12.3905 11.9166 12.1536 12.1536C11.9166 12.3905 11.7566 12.6934 11.6944 13.0227L10.8186 17.6544C10.7829 17.8456 10.6814 18.0182 10.5318 18.1425C10.3822 18.2667 10.1939 18.3347 9.99939 18.3347C9.80492 18.3347 9.61658 18.2667 9.46697 18.1425C9.31737 18.0182 9.21593 17.8456 9.18022 17.6544L8.30439 13.0227C8.24219 12.6934 8.08216 12.3905 7.8452 12.1536C7.60824 11.9166 7.30535 11.7566 6.97606 11.6944L2.34439 10.8186C2.15323 10.7829 1.98057 10.6814 1.85632 10.5318C1.73208 10.3822 1.66406 10.1939 1.66406 9.99939C1.66406 9.80492 1.73208 9.61658 1.85632 9.46697C1.98057 9.31737 2.15323 9.21593 2.34439 9.18022L6.97606 8.30439C7.30535 8.24219 7.60824 8.08216 7.8452 7.8452C8.08216 7.60824 8.24219 7.30535 8.30439 6.97606L9.18022 2.34439Z"
        stroke={strokeColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.666 1.66602V4.99935"
        stroke={strokeColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 3.33301H15"
        stroke={strokeColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33268 18.3333C4.25316 18.3333 4.99935 17.5871 4.99935 16.6667C4.99935 15.7462 4.25316 15 3.33268 15C2.41221 15 1.66602 15.7462 1.66602 16.6667C1.66602 17.5871 2.41221 18.3333 3.33268 18.3333Z"
        stroke={strokeColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const HpSalesIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 1.66699V18.3337"
        stroke={strokeColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1667 4.16699H7.91667C7.14312 4.16699 6.40125 4.47428 5.85427 5.02126C5.30729 5.56825 5 6.31011 5 7.08366C5 7.85721 5.30729 8.59907 5.85427 9.14605C6.40125 9.69303 7.14312 10.0003 7.91667 10.0003H12.0833C12.8569 10.0003 13.5987 10.3076 14.1457 10.8546C14.6927 11.4016 15 12.1434 15 12.917C15 13.6905 14.6927 14.4324 14.1457 14.9794C13.5987 15.5264 12.8569 15.8337 12.0833 15.8337H5"
        stroke={strokeColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const HpBankingIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.334 3.33398H2.66732C1.93094 3.33398 1.33398 3.93094 1.33398 4.66732V11.334C1.33398 12.0704 1.93094 12.6673 2.66732 12.6673H13.334C14.0704 12.6673 14.6673 12.0704 14.6673 11.334V4.66732C14.6673 3.93094 14.0704 3.33398 13.334 3.33398Z"
        stroke={strokeColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1.33398 6.66602H14.6673"
        stroke={strokeColor}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export const HpProductFloorIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16h.01" />
      <path d="M16 16h.01" />
      <path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
      <path d="M8 16h.01" />
    </svg>
  );
};

export const HpContactsIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3327 17.5V15.8333C13.3327 14.9493 12.9815 14.1014 12.3564 13.4763C11.7313 12.8512 10.8834 12.5 9.99935 12.5H4.99935C4.11529 12.5 3.26745 12.8512 2.64233 13.4763C2.01721 14.1014 1.66602 14.9493 1.66602 15.8333V17.5"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.334 2.60645C14.0488 2.79175 14.6818 3.20917 15.1337 3.79316C15.5856 4.37716 15.8308 5.09469 15.8308 5.83311C15.8308 6.57154 15.5856 7.28906 15.1337 7.87306C14.6818 8.45706 14.0488 8.87447 13.334 9.05978"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M18.334 17.5001V15.8334C18.3334 15.0948 18.0876 14.3774 17.6351 13.7937C17.1826 13.2099 16.5491 12.793 15.834 12.6084"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.49935 9.16667C9.3403 9.16667 10.8327 7.67428 10.8327 5.83333C10.8327 3.99238 9.3403 2.5 7.49935 2.5C5.6584 2.5 4.16602 3.99238 4.16602 5.83333C4.16602 7.67428 5.6584 9.16667 7.49935 9.16667Z"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export const HpMachinesIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_26_11794)">
        <path
          d="M9.16732 8.5582L5.83398 2.7832"
          stroke={strokeColor}
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9.16732 11.4414L5.83398 17.2164"
          stroke={strokeColor}
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10 18.3337V16.667"
          stroke={strokeColor}
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10 1.66699V3.33366"
          stroke={strokeColor}
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M11.666 10H18.3327"
          stroke={strokeColor}
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14.1673 17.2171L13.334 15.7754"
          stroke={strokeColor}
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14.1673 2.7832L13.334 4.22487"
          stroke={strokeColor}
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M1.66602 10H3.33268"
          stroke={strokeColor}
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17.2171 14.1673L15.7754 13.334"
          stroke={strokeColor}
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17.2171 5.83398L15.7754 6.66732"
          stroke={strokeColor}
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2.7832 14.1663L4.22487 13.333"
          stroke={strokeColor}
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2.7832 5.83301L4.22487 6.66634"
          stroke={strokeColor}
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.0007 11.6673C10.9211 11.6673 11.6673 10.9211 11.6673 10.0007C11.6673 9.08018 10.9211 8.33398 10.0007 8.33398C9.08018 8.33398 8.33398 9.08018 8.33398 10.0007C8.33398 10.9211 9.08018 11.6673 10.0007 11.6673Z"
          stroke={strokeColor}
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.0007 16.6673C13.6825 16.6673 16.6673 13.6825 16.6673 10.0007C16.6673 6.31875 13.6825 3.33398 10.0007 3.33398C6.31875 3.33398 3.33398 6.31875 3.33398 10.0007C3.33398 13.6825 6.31875 16.6673 10.0007 16.6673Z"
          stroke={strokeColor}
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_26_11794">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const HpMachinesAdminIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 17h-8a1 1 0 0 1 -1 -1v-12a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v8" />
      <path d="M3 13h13" />
      <path d="M8 21h4" />
      <path d="M10 17l-.5 4" />
      <path d="M17.001 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M19.001 15.5v1.5" />
      <path d="M19.001 21v1.5" />
      <path d="M22.032 17.25l-1.299 .75" />
      <path d="M17.27 20l-1.3 .75" />
      <path d="M15.97 17.25l1.3 .75" />
      <path d="M20.733 20l1.3 .75" />
    </svg>
  );
};

export const HpMaterialsIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.16667 18.1079C9.42003 18.2542 9.70744 18.3312 10 18.3312C10.2926 18.3312 10.58 18.2542 10.8333 18.1079L16.6667 14.7746C16.9198 14.6285 17.13 14.4183 17.2763 14.1653C17.4225 13.9123 17.4997 13.6252 17.5 13.3329V6.66626C17.4997 6.37399 17.4225 6.08693 17.2763 5.8339C17.13 5.58086 16.9198 5.37073 16.6667 5.22459L10.8333 1.89126C10.58 1.74498 10.2926 1.66797 10 1.66797C9.70744 1.66797 9.42003 1.74498 9.16667 1.89126L3.33333 5.22459C3.08022 5.37073 2.86998 5.58086 2.72372 5.8339C2.57745 6.08693 2.5003 6.37399 2.5 6.66626V13.3329C2.5003 13.6252 2.57745 13.9123 2.72372 14.1653C2.86998 14.4183 3.08022 14.6285 3.33333 14.7746L9.16667 18.1079Z"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 18.3333V10"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2.74219 5.83398L10.0005 10.0007L17.2589 5.83398"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.25 3.55859L13.75 7.85026"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export const HpMaterialsAdminIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22v-9" />
      <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" />
      <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" />
      <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z" />
    </svg>
  );
};

export const HpMaterialsAdminIconNew = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
      <path d="m7 16.5-4.74-2.85" />
      <path d="m7 16.5 5-3" />
      <path d="M7 16.5v5.17" />
      <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
      <path d="m17 16.5-5-3" />
      <path d="m17 16.5 4.74-2.85" />
      <path d="M17 16.5v5.17" />
      <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
      <path d="M12 8 7.26 5.15" />
      <path d="m12 8 4.74-2.85" />
      <path d="M12 13.5V8" />
    </svg>
  );
};

export const HpActionsIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.18022 2.34439C9.21593 2.15323 9.31737 1.98057 9.46697 1.85632C9.61658 1.73208 9.80492 1.66406 9.99939 1.66406C10.1939 1.66406 10.3822 1.73208 10.5318 1.85632C10.6814 1.98057 10.7829 2.15323 10.8186 2.34439L11.6944 6.97606C11.7566 7.30535 11.9166 7.60824 12.1536 7.8452C12.3905 8.08216 12.6934 8.24219 13.0227 8.30439L17.6544 9.18022C17.8456 9.21593 18.0182 9.31737 18.1425 9.46697C18.2667 9.61658 18.3347 9.80492 18.3347 9.99939C18.3347 10.1939 18.2667 10.3822 18.1425 10.5318C18.0182 10.6814 17.8456 10.7829 17.6544 10.8186L13.0227 11.6944C12.6934 11.7566 12.3905 11.9166 12.1536 12.1536C11.9166 12.3905 11.7566 12.6934 11.6944 13.0227L10.8186 17.6544C10.7829 17.8456 10.6814 18.0182 10.5318 18.1425C10.3822 18.2667 10.1939 18.3347 9.99939 18.3347C9.80492 18.3347 9.61658 18.2667 9.46697 18.1425C9.31737 18.0182 9.21593 17.8456 9.18022 17.6544L8.30439 13.0227C8.24219 12.6934 8.08216 12.3905 7.8452 12.1536C7.60824 11.9166 7.30535 11.7566 6.97606 11.6944L2.34439 10.8186C2.15323 10.7829 1.98057 10.6814 1.85632 10.5318C1.73208 10.3822 1.66406 10.1939 1.66406 9.99939C1.66406 9.80492 1.73208 9.61658 1.85632 9.46697C1.98057 9.31737 2.15323 9.21593 2.34439 9.18022L6.97606 8.30439C7.30535 8.24219 7.60824 8.08216 7.8452 7.8452C8.08216 7.60824 8.24219 7.30535 8.30439 6.97606L9.18022 2.34439Z"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.666 1.66602V4.99935"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M18.3333 3.33301H15"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3.33268 18.3333C4.25316 18.3333 4.99935 17.5871 4.99935 16.6667C4.99935 15.7462 4.25316 15 3.33268 15C2.41221 15 1.66602 15.7462 1.66602 16.6667C1.66602 17.5871 2.41221 18.3333 3.33268 18.3333Z"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export const HpReportIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5007 1.66602H5.00065C4.55862 1.66602 4.1347 1.84161 3.82214 2.15417C3.50958 2.46673 3.33398 2.89065 3.33398 3.33268V16.666C3.33398 17.108 3.50958 17.532 3.82214 17.8445C4.1347 18.1571 4.55862 18.3327 5.00065 18.3327H15.0007C15.4427 18.3327 15.8666 18.1571 16.1792 17.8445C16.4917 17.532 16.6673 17.108 16.6673 16.666V5.83268L12.5007 1.66602Z"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.666 1.66602V4.99935C11.666 5.44138 11.8416 5.8653 12.1542 6.17786C12.4667 6.49042 12.8907 6.66602 13.3327 6.66602H16.666"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.33268 7.5H6.66602"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.3327 10.834H6.66602"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.3327 14.166H6.66602"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export const HpSettingsIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.05991 3.44712C8.10582 2.96407 8.33019 2.51549 8.68916 2.18902C9.04813 1.86255 9.51593 1.68164 10.0012 1.68164C10.4864 1.68164 10.9542 1.86255 11.3132 2.18902C11.6721 2.51549 11.8965 2.96407 11.9424 3.44712C11.97 3.75916 12.0724 4.05997 12.2409 4.32407C12.4093 4.58817 12.639 4.80779 12.9103 4.96435C13.1816 5.12091 13.4867 5.20979 13.7997 5.22347C14.1126 5.23715 14.4243 5.17523 14.7082 5.04295C15.1492 4.84277 15.6488 4.8138 16.1099 4.96169C16.571 5.10958 16.9606 5.42374 17.2028 5.84304C17.4451 6.26233 17.5226 6.75676 17.4204 7.23009C17.3182 7.70343 17.0436 8.1218 16.6499 8.40378C16.3936 8.58366 16.1843 8.82262 16.0398 9.10047C15.8954 9.37832 15.8199 9.68687 15.8199 10C15.8199 10.3132 15.8954 10.6217 16.0398 10.8996C16.1843 11.1774 16.3936 11.4164 16.6499 11.5963C17.0436 11.8783 17.3182 12.2966 17.4204 12.77C17.5226 13.2433 17.4451 13.7377 17.2028 14.157C16.9606 14.5763 16.571 14.8905 16.1099 15.0384C15.6488 15.1863 15.1492 15.1573 14.7082 14.9571C14.4243 14.8248 14.1126 14.7629 13.7997 14.7766C13.4867 14.7903 13.1816 14.8792 12.9103 15.0357C12.639 15.1923 12.4093 15.4119 12.2409 15.676C12.0724 15.9401 11.97 16.2409 11.9424 16.553C11.8965 17.036 11.6721 17.4846 11.3132 17.8111C10.9542 18.1375 10.4864 18.3184 10.0012 18.3184C9.51593 18.3184 9.04813 18.1375 8.68916 17.8111C8.33019 17.4846 8.10582 17.036 8.05991 16.553C8.03236 16.2408 7.92999 15.9399 7.76146 15.6757C7.59294 15.4115 7.36322 15.1918 7.09177 15.0352C6.82032 14.8786 6.51513 14.7898 6.20206 14.7762C5.88898 14.7626 5.57724 14.8247 5.29324 14.9571C4.85232 15.1573 4.35268 15.1863 3.89158 15.0384C3.43047 14.8905 3.04089 14.5763 2.79864 14.157C2.5564 13.7377 2.47884 13.2433 2.58104 12.77C2.68325 12.2966 2.95791 11.8783 3.35158 11.5963C3.60793 11.4164 3.81718 11.1774 3.96165 10.8996C4.10611 10.6217 4.18154 10.3132 4.18154 10C4.18154 9.68687 4.10611 9.37832 3.96165 9.10047C3.81718 8.82262 3.60793 8.58366 3.35158 8.40378C2.95846 8.12166 2.68428 7.70345 2.58233 7.23044C2.48037 6.75743 2.55792 6.2634 2.7999 5.84438C3.04188 5.42536 3.431 5.11127 3.89165 4.96315C4.3523 4.81504 4.85156 4.84348 5.29241 5.04295C5.57637 5.17523 5.88803 5.23715 6.20099 5.22347C6.51396 5.20979 6.81902 5.12091 7.09036 4.96435C7.36169 4.80779 7.59132 4.58817 7.7598 4.32407C7.92827 4.05997 8.03064 3.75916 8.05824 3.44712"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
        stroke={strokeColor}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export const HpCustomerServiceIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
      <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
    </svg>
  );
};

export const HpListArrowIcon = ({
  isOpen = false,
  isSelected = false,
  isRTL = false,
}: {
  isOpen?: boolean;
  isSelected?: boolean;
  isRTL?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: isOpen
          ? isRTL
            ? "rotate(-90deg)"
            : "rotate(90deg)"
          : "rotate(0deg)",
        transition: "transform 0.2s ease",
      }}
    >
      <path
        d={isRTL ? "M10 4L6 8L10 12" : "M6 4L10 8L6 12"}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const HpCustomerReportsIconOld = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 22h5a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v3.3" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="m7.69 16.479 1.29 4.88a.5.5 0 0 1-.698.591l-1.843-.849a1 1 0 0 0-.879.001l-1.846.85a.5.5 0 0 1-.692-.593l1.29-4.88" />
      <circle cx="6" cy="14" r="3" />
    </svg>
  );
};

export const HpCompanyReportIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="M8 18v-1" />
      <path d="M12 18v-6" />
      <path d="M16 18v-3" />
    </svg>
  );
};

export const HpPurchaseIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <path d="M13 17h-7v-14h-2" />
      <path d="M6 5l14 1l-.575 4.022m-4.925 2.978h-8.5" />
      <path d="M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
      <path d="M19 21v1m0 -8v1" />
    </svg>
  );
};

export const HpAccountingReportsIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="m16 13-3.5 3.5-2-2L8 17" />
    </svg>
  );
};

export const HpCustomerReportsIcon = ({
  isSelected = false,
}: {
  isSelected?: boolean;
}) => {
  const strokeColor = isSelected ? "#001CB0" : "#1A1A1A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="M16 22a4 4 0 0 0-8 0" />
      <circle cx="12" cy="15" r="3" />
    </svg>
  );
};

export const getHpIcon = (
  tabKey: string,
  isSelected?: boolean
): ((isSelected?: boolean) => JSX.Element) | null => {
  const iconMap: {
    [key: string]: (isSelected?: boolean) => JSX.Element;
  } = {
    home: (isSelected?: boolean) => <HpHomeIcon isSelected={isSelected} />,
    goAI: (isSelected?: boolean) => <HpAIIcon isSelected={isSelected} />,
    productFloor: (isSelected?: boolean) => (
      <HpProductFloorIcon isSelected={isSelected} />
    ),
    sales: (isSelected?: boolean) => <HpSalesIcon isSelected={isSelected} />,
    purchase: (isSelected?: boolean) => <HpPurchaseIcon isSelected={isSelected} />,
    banking: (isSelected?: boolean) => (
      <HpBankingIcon isSelected={isSelected} />
    ),
    contacts: (isSelected?: boolean) => (
      <HpContactsIcon isSelected={isSelected} />
    ),
    machines: (isSelected?: boolean) => (
      <HpMachinesIcon isSelected={isSelected} />
    ),
    machinesAdmin: (isSelected?: boolean) => (
      <HpMachinesAdminIcon isSelected={isSelected} />
    ),
    materials: (isSelected?: boolean) => (
      <HpMaterialsIcon isSelected={isSelected} />
    ),
    materialsAdmin: (isSelected?: boolean) => (
      <HpMaterialsAdminIconNew isSelected={isSelected} />
    ),
    actions: (isSelected?: boolean) => (
      <HpActionsIcon isSelected={isSelected} />
    ),
    customerReports: (isSelected?: boolean) => (
      // <HpReportIcon isSelected={isSelected} />
      <HpCustomerReportsIcon  isSelected={isSelected}/>
    ),
    supplierReports: (isSelected?: boolean) => (
      <HpReportIcon isSelected={isSelected} />
    ),
    accountingReports: (isSelected?: boolean) => (
      <HpAccountingReportsIcon isSelected={isSelected} />
    ),
    settings: (isSelected?: boolean) => (
      <HpSettingsIcon isSelected={isSelected} />
    ),
    companyReports: (isSelected?: boolean) => (
      <HpCompanyReportIcon isSelected={isSelected} />
    ),
    customerService: (isSelected?: boolean) => (
      <HpCustomerServiceIcon isSelected={isSelected} />
    ),
  };

  return iconMap[tabKey] || null;
};

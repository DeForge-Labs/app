export default function ChatLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12 h-full opacity-50">
      <div className="scale-150">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path
              strokeDasharray="72"
              strokeDashoffset="72"
              d="M3 19.5v-15.5c0 -0.55 0.45 -1 1 -1h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-14.5Z"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="72;0;0;72"
                keyTimes="0;0.15;0.85;1"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>

            <path strokeDasharray="10" strokeDashoffset="10" d="M8 7h8">
              <animate
                attributeName="stroke-dashoffset"
                values="10;10;0;0;10;10"
                keyTimes="0;0.15;0.20;0.80;0.85;1"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>

            <path strokeDasharray="10" strokeDashoffset="10" d="M8 10h8">
              <animate
                attributeName="stroke-dashoffset"
                values="10;10;0;0;10;10"
                keyTimes="0;0.20;0.25;0.75;0.80;1"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>

            <path strokeDasharray="6" strokeDashoffset="6" d="M8 13h4">
              <animate
                attributeName="stroke-dashoffset"
                values="6;6;0;0;6;6"
                keyTimes="0;0.25;0.30;0.70;0.75;1"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </svg>
      </div>
    </div>
  );
}

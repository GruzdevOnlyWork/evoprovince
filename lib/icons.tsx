import type React from "react"

interface IconProps {
  name: keyof typeof I
  size?: number
  sw?: number
  className?: string
  style?: React.CSSProperties
}

const I = {
  bars:     "M4 6v12M9 6v12M15 6v12M20 6v12M4 9h5M15 9h5M9 15h6",
  kid:      "M12 5a2 2 0 100-.01M6 21l2-7h8l2 7M9 14v-3a3 3 0 016 0v3",
  medal:    "M8 4l2 6M16 4l-2 6M12 21a5 5 0 100-10 5 5 0 000 10zM12 16v1",
  flame:    "M12 3c1 4 5 5 5 9a5 5 0 01-10 0c0-2 1-3 2-4 .5 2 2 2 3-5z",
  dumbbell: "M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10",
  heart:    "M12 20s-7-4.5-7-10a4 4 0 017-2 4 4 0 017 2c0 5.5-7 10-7 10z",
  arrow:    "M5 12h14M13 6l6 6-6 6",
  arrowUR:  "M7 17L17 7M7 7h10v10",
  plus:     "M12 5v14M5 12h14",
  close:    "M6 6l12 12M18 6L6 18",
  chevL:    "M15 6l-6 6 6 6",
  chevR:    "M9 6l6 6-6 6",
  cal:      "M4 7h16v13H4zM4 11h16M8 3v4M16 3v4",
  grid2:    "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
  photo:    "M4 5h16v14H4zM4 15l5-5 4 4 3-3 4 4M9 9a1.5 1.5 0 100-.01",
  news:     "M4 5h16v14H4zM8 9h8M8 13h8M8 17h5",
  layers:   "M12 3l9 5-9 5-9-5 9-5zM3 14l9 5 9-5",
  edit:     "M4 20h4L18 10l-4-4L4 16v4zM14 6l4 4",
  trash:    "M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13",
  eye:      "M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7zM12 9a3 3 0 100 6 3 3 0 000-6z",
  chat:     "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  clock:    "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2",
  pin:      "M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 8a2 2 0 100 4 2 2 0 000-4z",
  insta:    "M16 3H8a5 5 0 00-5 5v8a5 5 0 005 5h8a5 5 0 005-5V8a5 5 0 00-5-5zM12 8a4 4 0 100 8 4 4 0 000-8zM17 7a1 1 0 100-2 1 1 0 000 2z",
  send:     "M4 11l16-7-7 16-2-7-7-2z",
  vk:       "M3 8c1 6 5 9 9 9h1v-3c1 0 2 1 3 2l1 1h2c-.5-1.5-2-3-3-3.5 1-1 2.5-3 3-4.5h-2c-.5 1.5-2 3.5-3 3.5V8h-2v4c-2-.5-3.5-2.5-4-4H3z",
  back:     "M11 6l-6 6 6 6M5 12h14",
  dash:     "M5 12h14",
  check:    "M5 12l4 4 10-10",
  burger:   "M4 7h16M4 12h16M4 17h16",
}

export function Icon({ name, size = 20, sw = 1.6, className = "", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d={I[name]} />
    </svg>
  )
}

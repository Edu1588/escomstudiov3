"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Frame {
  id: number
  title?: string
  video?: string
  image?: string
  defaultPos: { x: number; y: number; w: number; h: number }
  corner?: string
  edgeHorizontal?: string
  edgeVertical?: string
  mediaSize: number
  borderThickness?: number
  borderSize?: number
}

interface FrameComponentProps {
  id: number
  title?: string
  video?: string
  image?: string
  width: number | string
  height: number | string
  className?: string
  corner?: string
  edgeHorizontal?: string
  edgeVertical?: string
  mediaSize: number
  borderThickness?: number
  borderSize?: number
  showFrame: boolean
  isHovered: boolean
}

function FrameComponent({
  id,
  title,
  video,
  image,
  width,
  height,
  className = "",
  corner,
  edgeHorizontal,
  edgeVertical,
  mediaSize,
  borderThickness = 0,
  borderSize = 100,
  showFrame,
  isHovered,
}: FrameComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isHovered) {
      videoRef.current?.play()
    } else {
      videoRef.current?.pause()
    }
  }, [isHovered])

  return (
    <div
      className={`relative ${className} group`}
      style={{
        width,
        height,
        transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
      }}
    >
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black border-[0.5px] border-white/10 border-solid">
        {/* Title layer */}
        {title && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 pointer-events-none">
            <h3 className={`text-white text-center transition-all duration-500 font-rajdhani tracking-[0.1em] font-light uppercase pointer-events-none ${isHovered ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} text-xl md:text-3xl lg:text-4xl`}>
              {title}
            </h3>
          </div>
        )}

        <div
          className="absolute inset-0 flex items-center justify-center bg-black"
          style={{
            zIndex: 1,
            transition: "all 0.3s ease-in-out",
            padding: showFrame ? `${borderThickness}px` : "0",
            width: showFrame ? `${borderSize}%` : "100%",
            height: showFrame ? `${borderSize}%` : "100%",
            left: showFrame ? `${(100 - borderSize) / 2}%` : "0",
            top: showFrame ? `${(100 - borderSize) / 2}%` : "0",
          }}
        >
          <div
            className="w-full h-full overflow-hidden"
            style={{
              transform: `scale(${mediaSize})`,
              transformOrigin: "center",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            {video ? (
              <video
                className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'grayscale-0 opacity-100 scale-100' : 'grayscale opacity-0 scale-105'}`}
                src={video}
                loop
                muted
                playsInline
                ref={videoRef}
              />
            ) : image ? (
              <img
                className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'grayscale-0 opacity-100 scale-100' : 'grayscale opacity-0 scale-105 select-none'}`}
                src={image}
                alt={title || ""}
              />
            ) : null}
          </div>
        </div>

        {showFrame && corner && edgeHorizontal && edgeVertical && (
          <div className="absolute inset-0" style={{ zIndex: 2 }}>
            <div
              className="absolute top-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})` }}
            />
            <div
              className="absolute top-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})`, transform: "scaleX(-1)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})`, transform: "scaleY(-1)" }}
            />
            <div
              className="absolute bottom-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})`, transform: "scale(-1, -1)" }}
            />

            <div
              className="absolute top-0 left-16 right-16 h-16"
              style={{
                backgroundImage: `url(${edgeHorizontal})`,
                backgroundSize: "auto 64px",
                backgroundRepeat: "repeat-x",
              }}
            />
            <div
              className="absolute bottom-0 left-16 right-16 h-16"
              style={{
                backgroundImage: `url(${edgeHorizontal})`,
                backgroundSize: "auto 64px",
                backgroundRepeat: "repeat-x",
                transform: "rotate(180deg)",
              }}
            />
            <div
              className="absolute left-0 top-16 bottom-16 w-16"
              style={{
                backgroundImage: `url(${edgeVertical})`,
                backgroundSize: "64px auto",
                backgroundRepeat: "repeat-y",
              }}
            />
            <div
              className="absolute right-0 top-16 bottom-16 w-16"
              style={{
                backgroundImage: `url(${edgeVertical})`,
                backgroundSize: "64px auto",
                backgroundRepeat: "repeat-y",
                transform: "scaleX(-1)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

interface DynamicFrameLayoutProps {
  frames: Frame[]
  className?: string
  showFrames?: boolean
  hoverSize?: number
  gapSize?: number
}

export function DynamicFrameLayout({ 
  frames: initialFrames, 
  className,
  showFrames = false,
  hoverSize = 6,
  gapSize = 4
}: DynamicFrameLayoutProps) {
  const [frames] = useState<Frame[]>(initialFrames)
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null)

  const getRowSizes = () => {
    if (hovered === null) return "4fr 4fr 4fr"
    const { row } = hovered
    const gridRows = 3
    const nonHoveredSize = (12 - hoverSize) / (gridRows - 1)
    return [0, 1, 2].map((r) => (r === row ? `${hoverSize}fr` : `${nonHoveredSize}fr`)).join(" ")
  }

  const getColSizes = () => {
    if (hovered === null) return "4fr 4fr 4fr"
    const { col } = hovered
    const gridCols = 3
    const nonHoveredSize = (12 - hoverSize) / (gridCols - 1)
    return [0, 1, 2].map((c) => (c === col ? `${hoverSize}fr` : `${nonHoveredSize}fr`)).join(" ")
  }

  const getTransformOrigin = (x: number, y: number) => {
    const vertical = y === 0 ? "top" : y === 4 ? "center" : "bottom"
    const horizontal = x === 0 ? "left" : x === 4 ? "center" : "right"
    return `${vertical} ${horizontal}`
  }

  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{
        display: "grid",
        gridTemplateRows: getRowSizes(),
        gridTemplateColumns: getColSizes(),
        transition: "grid-template-rows 0.4s ease, grid-template-columns 0.4s ease",
      }}
    >
      {frames.map((frame) => {
        const row = Math.floor(frame.defaultPos.y / 4)
        const col = Math.floor(frame.defaultPos.x / 4)
        const transformOrigin = getTransformOrigin(frame.defaultPos.x, frame.defaultPos.y)

        return (
          <motion.div
            key={frame.id}
            className="relative overflow-hidden"
            style={{
              transformOrigin,
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={() => setHovered({ row, col })}
            onMouseLeave={() => setHovered(null)}
          >
            <FrameComponent
              id={frame.id}
              title={frame.title}
              video={frame.video}
              image={frame.image}
              width="100%"
              height="100%"
              className="absolute inset-0"
              corner={frame.corner}
              edgeHorizontal={frame.edgeHorizontal}
              edgeVertical={frame.edgeVertical}
              mediaSize={frame.mediaSize}
              borderThickness={frame.borderThickness}
              borderSize={frame.borderSize}
              showFrame={showFrames}
              isHovered={hovered?.row === row && hovered?.col === col}
            />
          </motion.div>
        )
      })}
    </div>
  )
}

"use client";
import React from "react";
import { Radar, IconContainer } from "./radar-effect";
import { HiDocumentText, HiDocumentReport } from "react-icons/hi";
import { HiMiniDocumentArrowUp } from "react-icons/hi2";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsClipboardDataFill } from "react-icons/bs";
import { BiSolidReport } from "react-icons/bi";
import { RiFilePaper2Fill } from "react-icons/ri";

export function RadarEffectDemo() {
  return (
    <div className="flex min-h-[500px] w-full items-center justify-center bg-transparent mt-12 md:mt-0">
      <div className="relative flex h-96 w-full max-w-3xl flex-col items-center justify-center space-y-4 overflow-hidden px-4 scale-75 md:scale-90 lg:scale-100 min-w-[320px] ml-[-20px] md:ml-0">
        {/* Row 1 */}
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
            {/* @ts-ignore */}
            <IconContainer text="Web Development" delay={0.2} icon={<HiDocumentText className="h-8 w-8 text-[#00d1ff] opacity-80" />} />
            {/* @ts-ignore */}
            <IconContainer delay={0.4} text="Mobile apps" icon={<AiFillDollarCircle className="h-8 w-8 text-[#00d1ff] opacity-80" />} />
            {/* @ts-ignore */}
            <IconContainer text="Designing" delay={0.3} icon={<BsClipboardDataFill className="h-8 w-8 text-[#00d1ff] opacity-80" />} />
          </div>
        </div>
        {/* Row 2 */}
        <div className="mx-auto w-full max-w-md">
          <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
            {/* @ts-ignore */}
            <IconContainer text="Maintenence" delay={0.5} icon={<BiSolidReport className="h-8 w-8 text-[#00d1ff] opacity-80" />} />
            {/* @ts-ignore */}
            <IconContainer text="Server management" delay={0.8} icon={<HiMiniDocumentArrowUp className="h-8 w-8 text-[#00d1ff] opacity-80" />} />
          </div>
        </div>
        {/* Row 3 */}
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
            {/* @ts-ignore */}
            <IconContainer delay={0.6} text="GitHub Integration" icon={<HiDocumentReport className="h-8 w-8 text-[#00d1ff] opacity-80" />} />
            {/* @ts-ignore */}
            <IconContainer delay={0.7} text="CMS Integration" icon={<RiFilePaper2Fill className="h-8 w-8 text-[#00d1ff] opacity-80" />} />
          </div>
        </div>

        <Radar className="absolute -bottom-12 left-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 z-[41] h-[2px] w-full bg-gradient-to-r from-transparent via-[#00d1ff] to-transparent opacity-20" />
      </div>
    </div>
  );
}

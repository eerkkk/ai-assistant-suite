import React from "react";
import Lottie from "react-lottie";
import { defaultAnimationProps } from "@/utils/lottie-service";

import * as wanderlustLoadingAnimation from "../../../../public/assets/journey-planner-loading-animation.json";
import * as essayWriterLoadingAnimation from "../../../../public/assets/essay-writer-loading-animation.json";
import * as resumeLoadingAnimation from "../../../../public/assets/resume-loading.json";
import * as greetingLoadingAnimation from "../../../../public/assets/greeting-loading-animation.json";
import * as storyLoadingAnimation from "../../../../public/assets/story-loading-animation.json";

import { ProjectTypeEnums } from "@/utils/types";

interface LoadingProps {
  projectType: ProjectTypeEnums;
}

export const Loading: React.FC<LoadingProps> = ({ projectType }) => {
  const loadingAnimation = {
    [ProjectTypeEnums.GREETIFY_COMPANION]: greetingLoadingAnimation,
    [ProjectTypeEnums.STORYTIME_COMPANION]: storyLoadingAnimation,
    [ProjectTypeEnums.WANDERLUST_COMPANION]: wanderlustLoadingAnimation,
    [ProjectTypeEnums.WORDSMITH_COMPANION]: essayWriterLoadingAnimation,
    [ProjectTypeEnums.COVER_LETTER_COMPANION]: resumeLoadingAnimation,
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 top-0 z-10 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-700 opacity-75"></div>
      <div className="fixed bottom-0 left-0 right-0 top-0 z-20 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        <Lottie
          options={defaultAnimationProps(loadingAnimation[projectType])}
          isClickToPauseDisabled={true}
          width={200}
          height={200}
        />
        <span className="p-3 font-bold text-white">
          Please wait.. This may take a while..
        </span>
      </div>
    </>
  );
};

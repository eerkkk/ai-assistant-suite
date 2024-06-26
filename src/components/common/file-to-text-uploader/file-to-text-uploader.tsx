import { useEffect, useState } from "react";

import Image from "next/image";
import FileUploader from "@/components/common/file-uploader/file-uploader";

import fileToTextUploaderHelper from "@/components/common/file-to-text-uploader/file-to-text-uploader-helper";
import { getTextFromFile } from "@/services/file-to-text-converter/file-to-text-converter";

import { type FileTypeEnum } from "@/services/file-to-text-converter/types";

interface FileToTextUploaderProps {
  onTextReady: (text: string) => void;
  setDidLoadFile: (isReadingFile: boolean) => void;
  didLoadFile: boolean;
  uploadLabel?: string;
  id?: string;
}

export const FileToTextUploader: React.FC<FileToTextUploaderProps> = ({
  onTextReady,
  setDidLoadFile,
  didLoadFile,
  uploadLabel,
  id,
}) => {
  const [fileData, setFileData] = useState<string>("");
  const [imageData, setImageData] = useState<string>("");
  const [fileType, setFileType] = useState<FileTypeEnum>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    fileToTextUploaderHelper.onFileChange(
      e,
      setFileType,
      setFileData,
      setImageData
    );
  };

  useEffect(() => {
    const convertFileToText = async () => {
      if (!!fileData && !!fileType) {
        setDidLoadFile(false);
        const text = await getTextFromFile(fileType, fileData);
        onTextReady(text);
        setDidLoadFile(true);
      }
    };
    void convertFileToText();
  }, [fileData, fileType, onTextReady, setDidLoadFile]);

  return (
    <div className="m-5 flex h-auto w-auto flex-col items-center justify-center">
      <label
        htmlFor={id}
        className="md:text-md px-1 text-left font-bold capitalize text-ct-teal-600 xsm:text-sm"
      >
        {uploadLabel}
      </label>

      <div id={id} className="flex w-full items-center justify-center">
        <FileUploader onFileReady={onFileChange} />
      </div>

      <span className="px-1 py-2 text-sm text-slate-500">
        <p>only image and pdf formats are supported </p>
      </span>

      {!didLoadFile && (
        <span className="px-1 py-2 text-sm text-slate-500">
          <p>Please wait, Scanning the File</p>
        </span>
      )}

      {imageData && (
        <div className="display-flex">
          <Image src={imageData} alt="" width={150} height={150} />
        </div>
      )}
    </div>
  );
};

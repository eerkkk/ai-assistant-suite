import { FileTypeEnum } from "@/services/file-to-text-converter/types";
import { convertPdfToPng } from "@/services/pdf-to-png-converter/pdf-to-png-converter";

enum FileInputTypeEnum {
  PNG = "data:image/png;base64,",
  PDF = "data:application/pdf;base64,",
}

class FileToTextUploaderHelper {
  isPdf = (fileData: string) => {
    return fileData.startsWith(FileInputTypeEnum.PDF);
  };

  onFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFileType: (type: FileTypeEnum) => void,
    setFileData: (text: string) => void,
    setImageData: (text: string) => void
  ) => {
    if (!e.target.files?.length) {
      console.warn("no file selected");
      return;
    }

    const file = e.target.files[0] as File;
    const reader = new FileReader();

    reader.onloadend = async () => {
      if (!reader.result) {
        return;
      }

      const fileDataUri = reader.result as string;

      let fileType: FileTypeEnum;
      let base64FileData: string;
      let base64ImageData: string;

      if (this.isPdf(fileDataUri)) {
        const base64PdfData = fileDataUri.replace(FileInputTypeEnum.PDF, "");
        base64FileData = base64PdfData;
        base64ImageData = await convertPdfToPng(base64PdfData);
        fileType = FileTypeEnum.PDF;
      } else {
        base64FileData = fileDataUri;
        base64ImageData = fileDataUri;
        fileType = FileTypeEnum.PNG;
      }

      setImageData(base64ImageData);
      setFileData(base64FileData);
      setFileType(fileType);
    };

    reader.readAsDataURL(file);
  };
}

const fileToTextUploaderHelper = new FileToTextUploaderHelper();
export default fileToTextUploaderHelper;

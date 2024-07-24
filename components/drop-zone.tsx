/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Dropzone, { useDropzone } from "react-dropzone";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";
import { File } from "buffer";
import { FileIcon, X } from "lucide-react";

interface UploadDropzoneProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  height: "100%",
};

export const UploadDropzone = ({
  endpoint,
  onChange,
  value,
}: UploadDropzoneProps) => {
  const [uploadURL, setUploadURL] = useState(value || "");
  const [progress, setProgress] = useState(value ? 100 : 0);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploaded, setIsUploaded] = useState(value ? false : true);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ accept: { "image/*": [], "application/pdf": [] } });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const Thumbs = () => (
    <div
      className="inline-flex p-4 roinded-sm border-[1px] mb-0 mr-0 border-zinc-500 "
      key={uploadURL}
    >
      <div style={thumbInner}>
        <Image
          src={uploadURL}
          style={img}
          width={200}
          height={200}
          className="object-contain"
          alt="image Url"
          // Revoke data uri after image is loaded
        />
      </div>
    </div>
  );

  // handle uploads
  const onDrop = useCallback((acceptedFiles: any) => {
    setIsUploaded(false);

    const file = acceptedFiles[0];
    if (!file) return;
    // setFileType(file.split(".").pop());

    setFiles(
      acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );

    const storageRef = ref(storage, `${endpoint}/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(+progress.toFixed(2));
      },
      (error) => {
        console.error("Upload failed", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadURL(downloadURL);
          setIsUploaded(true);
          onChange(downloadURL);
        });
      }
    );
  }, []);

  useEffect(() => {
    if (value) {
      setUploadURL(value);
    }
  }, [value]);

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () =>
      files.forEach((file: any) => URL.revokeObjectURL(file?.preview!));
  }, []);

  const handleCancel = () => {
    onChange("");
    setFiles([]);
    setUploadURL("");
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="flex-1 flex flex-col items-center 
          p-5 text-[#bdbdbd] bg-[#fafafa] border-2 
          border-r-2 border-[#eeeeee] border-dashed 
          transition outline-none"
          >
            <input {...getInputProps()} />
            {!isUploaded && progress === 100 ? (
              <p>
                Drag &apos;n&apos; drop some files here, or click to change
                files
              </p>
            ) : (
              <p>
                Drag &apos;n&apos; drop some files here, or click to select
                files
              </p>
            )}
          </div>
        )}
      </Dropzone>

      <div className="flex flex-col space-y-2">
        {progress > 0 && progress !== 100 && (
          <p>Upload progress: {progress}%</p>
        )}
        {uploadURL && (
          <div className="flex items-center justify-center flex-col">
            {progress === 100 &&
              files[0] &&
              files[0]?.type &&
              files[0]?.type !== "application/pdf" && <Thumbs />}

            {progress === 100 &&
              files[0] &&
              files[0]?.type! === "application/pdf" && (
                <div className="relative flex items-center max-w-[350px]  p-2 mt-2 rounded-md bg-background/10">
                  <FileIcon className="h-20 w-20 fill-indigo-200 stroke-indigo-400" />
                  <a
                    href={uploadURL}
                    target="_blank"
                    rel="noopener noreferred"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline truncate"
                  >
                    {uploadURL}
                  </a>
                  <button
                    onClick={handleCancel}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

            {progress === 100 && isUploaded && (
              <p>File uploaded successfully!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

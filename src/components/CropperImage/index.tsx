import { useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import image_placeholder from "../../assets/imagem-placeholder.jpg";
import { ModalPopUp } from "../ModalPopUp";
import toast, { Toaster } from "react-hot-toast";
import "react-image-crop/dist/ReactCrop.css";
import "./index.css";
import { useHttp } from "../../lib";
import { AxiosError } from "axios";

interface UploadImageProps {
  img: string;
  setImage: (image: any) => void;
  className?: string;
  handleDeleteImage: (props?: any) => void;
  participantId: string;
}

export function UploadImage({
  img = image_placeholder,
  setImage: uploadImage,
  // className = "",
  handleDeleteImage,
  participantId,
}: UploadImageProps) {
  const axios = useHttp();

  const [imagemOfClient, setImagemOfClient] = useState(img);
  const [image, setImage] = useState<any>(null);
  const [viewImage, setViewImage] = useState("");
  const [src, setSrc] = useState(img);
  const [statusModal, setStatusModal] = useState(false);
  const [result, setResult] = useState(null);
  const [crop, setCrop] = useState<any>({ aspect: 9 / 9 });
  const [clickDeleteImage, setClickDeleteImage] = useState(false);

  useEffect(() => {
    if (img) {
      createFile("image").then((res) => {
        if (!res) {
          setImage(null);
          setSrc("");
          return console.log("erro ao criar arquivo");
        }
        setImage(res);
        setSrc(URL?.createObjectURL(res));
      });
      setImagemOfClient(img);
      setViewImage(img);
    } else {
      setImagemOfClient(image_placeholder);
      setViewImage(image_placeholder);
      setSrc("");
      setImage(null);
    }
    setResult(null);
    setCrop({ aspect: 9 / 9 });
    setClickDeleteImage(false);
  }, [img]);

  // url is https://participants-photo.s3.amazonaws.com/12981829844.jpg
  const createFile = async (filename: string) => {
    if (!participantId) return;
    try {
      const response = await axios.get(`/participants/${participantId}/photo`, {
        responseType: "blob",
      });
      const file = new File([response.data], filename, {
        type: response.headers["content-type"],
      });
      return file;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(
          "erro no axios familia",
          error.status,
          error.code,
          error.message
        );
      } else {
        console.log("erro nao é axios familia", error);
      }
    }
  };

  const handleFileChange = (e: any) => {
    if (!e?.target?.files[0]) return;
    const isNotFileImage = !e?.target?.files[0]?.type.includes("image/");
    if (isNotFileImage)
      return toast.error("Esse arquivo não é do tipo Imagem!");
    setSrc(URL?.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  function getCroppedImg() {
    if (!image) return;

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas?.toBlob((blob) => {
      setResult(blob as any);
    });
  }

  function handleStateModal() {
    setStatusModal((oldStatus) => !oldStatus);
  }

  function SaveImageModal() {
    function handleClickSave() {
      uploadImage(result || imagemOfClient);
      setViewImage(result ? URL?.createObjectURL(result) : imagemOfClient);
      if (clickDeleteImage) handleDeleteImage();
      handleStateModal();
    }

    return (
      <button
        onClick={() => handleClickSave()}
        type="button"
        className="button-cropper-save bg-primary-500 justify-center items-center cursor-pointer image-contrast font-poppins gap-1"
      >
        {imagemOfClient ? "Salvar" : "Salvar Corte"}
      </button>
    );
  }

  function SaveDisabled() {
    return (
      <button
        type="button"
        disabled={true}
        className="button-cropper-save-blocked bg-gray-500 font-poppins font-bold text-white w-[200px] rounded-md justify-center items-center cursor-not-allowed font-poppins gap-1 image-contrast"
      >
        Salvar{" "}
      </button>
    );
  }

  // function clearValuesImage() {
  //   setImage(null);
  //   setResult(null);
  //   uploadImage("");
  //   setSrc("");
  //   setViewImage("");
  //   setImagemOfClient(image_placeholder);
  //   setClickDeleteImage(true);
  // }

  return (
    <>
      <Toaster />
      <ModalPopUp
        className="w-[50vw] h-fit"
        classNameChildren="flex flex-col justify-around h-full"
        title="Editar imagem"
        status={statusModal}
        onClickCancel={handleStateModal}
      >
        <div className="invisible"></div>
        {src ? (
          <div className="w-full flex justify-around mx-2">
            <div
              onTouchMoveCapture={getCroppedImg}
              onMouseMoveCapture={getCroppedImg}
              className="flex"
            >
              <ReactCrop
                src={src}
                onImageLoaded={setImage}
                imageStyle={{ maxHeight: 300, maxWidth: 300 }}
                crop={crop}
                onChange={setCrop}
                minWidth={75}
                minHeight={75}
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexDirection: "row",
                  cursor: "crosshair",
                }}
                circularCrop={true}
              />
            </div>
            {!result ? (
              <p className="flex justify-center items-center w-1/3 text-xl text-center">
                Para salvar, recorte a imagem ao lado em formato de círcular.
              </p>
            ) : (
              ""
            )}
            {result && (
              <div className="flex items-center">
                <img
                  src={URL.createObjectURL(result)}
                  alt="Image"
                  width="200"
                  height="200"
                  className="rounded-full"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="w-1/2">
              <img
                src={imagemOfClient || image_placeholder}
                width="150px"
                height="150px"
                className="image-placeholder-modal rounded-full"
              />
            </div>
            <span className="text-primary-400 block w-1/2 text-center px-4 border-dashed border border-primary-800 rounded-md py-2">
              Para trocar a imagem, clique no botão no canto inferior esquerdo.
              <div className="w-full h-0.5 border-b border-primary-800 my-2" />
              Recorte a imagem para o formato circular da maneira que desejar.
              <div className="w-full h-0.5 border-b border-primary-800 my-2" />
              Clique em salvar para confirmar a edição.
            </span>
          </div>
        )}
        <div className={`w-full flex mt-10 justify-between`}>
          <label className="label-input-file flex justify-center items-center input-type-file border border-primary-500 cursor-pointer rounded-md">
            <span className="image-contrast gap-4 justify-center items-center text-center text-primary-500">
              {" "}
              {imagemOfClient || viewImage
                ? "Trocar Imagem"
                : "Adicionar Imagem"}{" "}
            </span>
            <input
              type="file"
              name="image"
              onChange={(e) => {
                handleFileChange(e);
                setResult(null);
              }}
              accept=".png, .jpg, .jpeg"
            />
          </label>
          {result ? <SaveImageModal /> : <SaveDisabled />}
        </div>
      </ModalPopUp>
      <ShowImage viewImage={imagemOfClient ? imagemOfClient : viewImage + `?stubby=${Math.random()}`} handleStateModal={handleStateModal} showUpdateOption={true} />
    </>
  );
}

interface ShowImageProps {
  viewImage: string;
  handleStateModal: () => void;
  showUpdateOption?: boolean;
}
function ShowImage({ viewImage, handleStateModal, showUpdateOption }: ShowImageProps) {
  return (
    <div className="relative">
      <img
        src={viewImage}
        onClick={handleStateModal}
        width="160px"
        height="160px"
        className="rounded-full"
      />
      {showUpdateOption && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 hover:opacity-100 transition-opacity" onClick={handleStateModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </div>
      )}
    </div>
  )
}
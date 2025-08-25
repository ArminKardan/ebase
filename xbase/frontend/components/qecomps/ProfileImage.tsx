import Cropper from 'react-easy-crop'
import Upload from './Upload'
import { useCallback, useEffect, useState } from 'react';
import WindowFloat from './WindowFloat';
// import Circle from './Circle';
import { SSRGlobal } from './Context';
import Component, { PageEl } from './Component';

export default p => Component(p, Page);
const Page: PageEl = (props: {} & { [key: string]: any }, refresh, getProps, onLoad, onConnected, dies, isFront, z)  => {

  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  dies(async () => {
    setScroller("wind")
  })


  useEffect(() => {
    localStorage.removeItem("uploader-profile-image")
    setImageSrc(z.enduser.image)
    setScroller("nothing")
  }, [])

  let aspectRatio = 1 // for a square (used for circle masking)
  let fileName = 'avatar.jpg';



  const onCropComplete = useCallback((_croppedArea: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = (err) => reject(err)
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
    })

  const cropImageToFile = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = Math.min(croppedAreaPixels.width, croppedAreaPixels.height)
    canvas.width = size
    canvas.height = size

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    // Create circular clip path
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(
      image,
      croppedAreaPixels.x * scaleX,
      croppedAreaPixels.y * scaleY,
      size * scaleX,
      size * scaleY,
      0,
      0,
      size,
      size
    )

    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], fileName, { type: 'image/png' }) // PNG keeps transparency
        uploadit.now?.(file)
      }
    }, 'image/png')
  }


  let uploadit = {} as any

  return <>
    <WindowFloat title={z.lang.profilepic} onclose={() => props.onclose?.()}>
      <input id="profileupload" type="file" accept="image/*" onChange={onFileChange} style={{ display: "none" }} />

      <div style={{ position: "relative", height: 300, width: "100%" }}>

        <Cropper
          key={z.enduser.uid + "_avatar_" + props.counter}
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          showGrid={true}
          onCropComplete={onCropComplete}
          cropShape="round" // This gives circular UI cropping mask
        />

      </div>


      <Upload
        id={"profile-image"}
        extensionfilter={[".jpg", ".png", '.jpeg', '.svg', '.webp']}
        // state={[pimage]}
        avatar={true}
        uploadit={uploadit as any}
        singlefile={true}
        maxsize={1024 * 1024}
        on={async (st) => {
          if (st.length == 0) return
          if (st[0].percent < 100) {
            props.imageSrc = global.cdn("/files/picload.svg");
            refresh();
          }
          else {
            setTimeout(async () => {
              let json = await changeenduser.image(st[0].url)

              if (json.code == 0) {
                localStorage.removeItem("uploader-profile-image")
                window.location.reload();
                props.onclose?.()
              }
              else {
                alerter(JSON.stringify(json))
              }
            }, 1000);

          }
        }}
      />


      <br-x />
      <b-200 class={z.qestyles.btncancel} style={{ flex: 1, backgroundColor: "#67b2d5", height:30 }}
        onClick={async () => {
          document.getElementById("profileupload").click()
        }}>
        {z.lang.uploadnewpic}
      </b-200>
      <br-xx />
      <f-cc class={z.qestyles.btnaccept}  style={{ height:30, ...z.crossstyles.forms.button.confirmstyle}} onClick={async () => {
        await cropImageToFile();
      }}>
        {z.lang.confirm}
      </f-cc>

      <br-x />
    </WindowFloat>
  </>
}

import Component, { PageEl } from '@/frontend/components/qecomps/Component'
import Window from '@/frontend/components/qecomps/Window';
import { useEffect } from 'react';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Router from 'next/router'
import Copy from '@/frontend/components/qecomps/Copy';
import FaDigits, { EnDigits } from '@/frontend/components/qecomps/FaDigits';
import TextBox from '@/frontend/components/qecomps/TextBox';
import Text from '@/frontend/components/qecomps/Text';
import AbbreviateDate from '@/frontend/components/qecomps/AbbreviateDate';
import Badge from '@/frontend/components/qecomps/Badge';
import Bold from '@/frontend/components/qecomps/Bold';
import Cap, { FAtoENRatio } from '@/frontend/components/qecomps/Cap';
import Circle from '@/frontend/components/qecomps/Circle';
import CountDown from '@/frontend/components/qecomps/CountDown';
import DropDown from '@/frontend/components/qecomps/DropDown';
import FindEmojies from '@/frontend/components/qecomps/FindEmojies';
import Flag from '@/frontend/components/qecomps/Flag';
import HandRankExplore from '@/frontend/components/qecomps/HandRankExplore';
import Icon2Titles from '@/frontend/components/qecomps/Icon2Titles';
import Icon3Titles from '@/frontend/components/qecomps/Icon3Titles';
import LinkHashtags from '@/frontend/components/qecomps/LinkHashtags';
import WindowFloat from '@/frontend/components/qecomps/WindowFloat';
import Num2EN from '@/frontend/components/qecomps/Num2EN';
import Num2FA from '@/frontend/components/qecomps/Num2FA';
import NumAbbrev from '@/frontend/components/qecomps/NumAbbrev';
import OpeningTitle from '@/frontend/components/qecomps/OpeningTitle';
import OpeningDetail from '@/frontend/components/qecomps/OpeningDetail';
import PhoneEditFloat from '@/frontend/components/qecomps/PhoneEditFloat';
import PriceTextBox from '@/frontend/components/qecomps/PriceTextBox';
import RemainingTime from '@/frontend/components/qecomps/RemainingTime';
import ReplacePro from '@/frontend/components/qecomps/ReplacePro';
import Search from '@/frontend/components/qecomps/Search';
import SerialGenerator from '@/frontend/components/qecomps/SerialGenerator';
import StarRating from '@/frontend/components/qecomps/StarRating';
import TextArea from '@/frontend/components/qecomps/TextArea';
import TextEndAbbreviation from '@/frontend/components/qecomps/TextEndAbbreviation';
import TextMidAbbreviation from '@/frontend/components/qecomps/TextMidAbbreviation';
import ToLocaleDateTime from '@/frontend/components/qecomps/ToLocaleDateTime';
import UserAvatar from '@/frontend/components/qecomps/UserAvatar';
import VItem from '@/frontend/components/qecomps/VItem';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';

import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BuildIcon from '@mui/icons-material/Build';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AlbumIcon from '@mui/icons-material/Album';
import ApprovalIcon from '@mui/icons-material/Approval';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateIcon from '@mui/icons-material/Create';
import DangerousIcon from '@mui/icons-material/Dangerous';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteIcon from '@mui/icons-material/Delete';
import DewPointIcon from '@mui/icons-material/DewPoint';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FactoryIcon from '@mui/icons-material/Factory';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import FolderIcon from '@mui/icons-material/Folder';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import GppGoodIcon from '@mui/icons-material/GppGood';
import GppBadIcon from '@mui/icons-material/GppBad';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import MicIcon from '@mui/icons-material/Mic';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';





export default p => Component(p, Page);

const Page: PageEl = (props, refresh, getProps, onLoad, onConnected, dies, isFront, z) => {

  getProps(async (isFront) => {
    props.item1 = { likes: 100, dislikes: 50, liked: false, disliked: true }
    props.item2 = { likes: 50, dislikes: 20, liked: true, disliked: false }
    props.search = "قهوه"
    props.stars1 = 1.5
    props.stars2 = 4
    props.counter = 10

    props.items = [
      {
        id: "siavashghomeyshi",
        name: "سیاوش قمیشی",
        score: 100,
        image: "https://cdn.ituring.ir/qeupload/635111b8ff61db2b04928f49/siavashghomayshiahoramusicir1jpg-00ytoubmoodoycpxead8ml9jngom16.jpg"
      },
      {
        id: "hayedeh",
        name: "هایده",
        score: 100,
        image: "https://cdn.ituring.ir/qeupload/635111b8ff61db2b04928f49/haydehdidarjpg-po2b1o5vvgffhn4cp1gtnulreqc63a.jpg"
      },
      {
        id: "ebi",
        name: "ابی",
        score: 100,
        image: "https://cdn.ituring.ir/qeupload/635111b8ff61db2b04928f49/jpg-i3k3k83fb8ipmmzaqpddnvdyy90qpy.jpg"
      },
    ]
  })

  let Lorem = <p style={{ padding: 10 }}>
    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
    استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه
    و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی
    تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای
    کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته
    حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد،
    تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه
    ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی
    ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در
    ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز
    شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای
    موجود طراحی اساسا مورد استفاده قرار گیرد.لورم ایپسوم متن ساختگی با
    تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است،
    چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است،
    و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود
    ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده،
    شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری
    را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو
    در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام
    و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد
    و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی
    سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
  </p>

  return <div style={{ direction: z.lang.dir, padding: 10 }}>


    {props.form == "phone" ? <PhoneEditFloat
      title='ورود شماره تماس'
      title2='لطفا شماره تماس خود را وارد کنید'
      explain={"۱: " + "لطفا شماره تماس خود را به دقت وارد نمایید."}
      countryitemclass={`flex min-h-[40px] rounded-md items-center bg-[#84B780] hover:bg-[#83BF7F] active:bg-[#79B075] m-1 cursor-pointer`}
      clist={{ title: z.lang.selcountry, title2: z.lang.searchccodes }}
      on={async (json) => { alerter(json) }}
      onclose={() => { props.form = null; refresh() }}
      
      /> : null}


    {props.form == "test" ? <WindowFloat title="پنجره تست" onclose={() => {
      props.form = null
      refresh()
    }} titletextcolor='#621C14' titlebgcolor='#648E6A' contentbgcolor='#BFC3D9'
      contentStyle={{ padding: 20 }} >
      {Lorem}
    </WindowFloat> : null}

    <Window title='تست' contentStyle={{ padding: 5 }}>

      <c-ss style={{width:100, height:100, backgroundColor:"pink",}}>
        Hi
      </c-ss>
      {AbbreviateDate(new Date(new Date().getTime() - 3600000), z)}
    </Window>


    <Window title='کامپوننت های DaisyUI' contentStyle={{ padding: 5 }}>

      <br-x />
      <br-x />
      <div className="divider">کامپوننت های مفید</div>
      <br-x />
      <br-x />

      <w-cse style={{ gap: 10 }}>

        <button className="btn btn-soft" style={{ fontWeight: 100 }} onClick={async () => {
          alerter(await API["system/ping"]({ text: "test" }))
        }}>API</button>

        <button className="btn btn-soft" style={{ fontWeight: 100 }} onClick={async () => {
          let r = await api("http://localhost:3000")
          console.log(r)

        }}>Rest API</button>

        <button className="btn btn-soft" style={{ fontWeight: 100 }} onClick={async () => {
          let enc = await encryptor("hiiii", "1234")
          alerter(await decryptor(enc, "1234"))
        }}>رمزنگاری</button>




        <button className="btn btn-soft" style={{ fontWeight: 100 }} onClick={async () => {
          let link = await fileexplorer()
          alerter(link)
        }}>فایل منیجر</button>

        <button className="btn btn-soft" style={{ fontWeight: 100 }} onClick={async () => {
          let link = await iconexplorer()
          alerter(link)
        }}>آیکون اکسپلورر</button>

        <button className="btn btn-soft" style={{ fontWeight: 100 }} onClick={async () => {
          let link = await linkpicker()
          alerter(link)
        }}>لینک پیکر</button>

        <button className="btn btn-neutral" style={{ fontWeight: 100 }} onClick={async () => {
          await calendarfa()
        }}>تقویم شمسی</button>

        <button className="btn btn-primary" style={{ fontWeight: 100 }} onClick={async () => {
          Copy("متن کپی شده است")
        }}>کپی متن روی کلیپبورد</button>


        <button className="btn btn-secondary" style={{ fontWeight: 100 }} onClick={async () => {
          alerter(SerialGenerator(30))
        }}>تولید سریال رندوم</button>

        <button className="btn btn-accent" style={{ fontWeight: 100 }} onClick={() => {
          alerter("my title", "my body", { backgroundColor: "#4C772FC2", padding: 10, borderRadius: 5, minHeight: 200 },
            cdn("/files/qecircular.webp"))
        }}>هشدار سفارشی</button>


        <button className="btn btn-info" style={{ fontWeight: 100 }} onClick={async () => {
          let valueString = await prompter("عنوان", "لطفا مقدار مورد نظر خود را وارد کنید؟")
        }}>دریافت مقدار از کاربر</button>


        <button className="btn btn-success" style={{ fontWeight: 100 }} onClick={async () => {
          let valueBoolean = await confirmer("عنوان", "آیا از انجام این عملیات اطمینان دارید؟")
        }}>تاییدیه کاربر</button>


        <button className="btn btn-warning" style={{ fontWeight: 100 }}
          onClick={async () => {
            await uploader({ text: "فایل مورد نظر را آپلود کنید", title: "آپلود فایل", maxmb: 10, max_age_sec: 3600 })
          }}>آپلود کاربر</button>


        <button className="btn btn-error" style={{ fontWeight: 100 }} onClick={() => {
          alerter([
            {
              sentence: "درود بی کران بر شما",
              ratio: FAtoENRatio("درود بی کران بر شما")
            },
            {
              sentence: "درود بی کران بر شما ۱۲۳۴",
              ratio: FAtoENRatio("درود بی کران بر شما ۱۲۳۴")
            },
            {
              sentence: "درود بی کران بر شما yoohoo",
              ratio: FAtoENRatio("درود بی کران بر شما yoohoo")
            }
          ])
        }}>نسبت فارسی به انگلیسی</button>

        <button className="btn btn-soft" style={{ fontWeight: 100 }}>
          <Bold><f-12> متن پررنگ از طرف فونت</f-12></Bold>
        </button>

        <button className="btn btn-soft btn-primary" style={{ fontWeight: 100 }} onClick={() => {
          alerter({ number: 15000, persian: NumAbbrev(2156, 3, "en-US") })
        }}>اختصار عدد</button>

        <button className="btn btn-soft btn-secondary" style={{ fontWeight: 100 }} onClick={() => {
          alerter({ number: 15000, persian: Num2FA(15000) })
        }}>عدد به حروف فارسی</button>

        <button className="btn btn-soft btn-info" style={{ fontWeight: 100 }} onClick={() => {
          alerter({ number: 15000, persian: Num2EN(15000) })
        }}>عدد به حروف انگلیسی</button>


        <button className="btn btn-soft btn-accent" style={{ fontWeight: 100 }} onClick={() => {
          alerter({
            text: " این متن 😁 حاوی 😂 چند ایموجی 😅 معروف است",
            filter: FindEmojies(" این متن 😁 حاوی 😂 چند ایموجی 😅 معروف است")
          })
        }}> 😍 یافتن ایموجی در متن</button>



        <button className="btn btn-soft btn-success" style={{ fontWeight: 100 }} onClick={() => {
          props.form = "test"
          refresh()
        }}>پنجره شناور</button>


        <button className="btn btn-soft btn-success" style={{ fontWeight: 100 }} onClick={async () => {
          log({ text: "Progress started...", type: "error" })
          await sleep(2000)
          log({ text: "Loading AI model...", type: "warning" })
          await sleep(1000)
          log({ text: "Loading weapons...", type: "ok" })
          await sleep(1500)
          log({ text: "The progress was successfull!", type: "ok" })
          await sleep(1000)
          closelog()
        }}>لاگ</button>


        <button className="btn btn-soft btn-warning" style={{ fontWeight: 100 }} onClick={() => {
          props.form = "phone";
          refresh()
        }}>دریافت شماره تلفن</button>

        <button className="btn btn-soft btn-error" style={{ fontWeight: 100 }} onClick={async () => {

          await selector(() => props.items.map(it => ({
            key: it.id,
            title1: it.name,
            title2: "امتیاز:" + it.score,
            image: it.image, highlight: it.selected
          })), async key => {
            props.items.find(i => i.id == key).selected ^= 1
          })
        }}>
          سلکتور (selector)
        </button>


        <button className="btn btn-soft" style={{ fontWeight: 100 }} onClick={async () => {
          let key = await picker(props.items.map(it => ({
            key: it.id,
            title1: it.name,
            title2: "امتیاز:" + it.score,
            image: it.image
          })),)
          alerter("شما " + key + " را انتخاب کردید.")
        }}>
          پیکر (picker)
        </button>
      </w-cse>


      <br-x />
      <br-x />
      <a href="https://daisyui.com/components/button/" target='_blank'><div className="divider">انواع دکمه ها (برای مشاهده لیست کلیک کنید)</div></a>

      <br-x />
      <br-x />

      <w-xse>
        <button className="btn btn-neutral">Neutral</button>
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-secondary">Secondary</button>
        <button className="btn btn-accent">Accent</button>
        <button className="btn btn-info">Info</button>
        <button className="btn btn-success">Success</button>
        <button className="btn btn-warning">Warning</button>
        <button className="btn btn-error">Error</button>
      </w-xse>
      <br-x />
      <br-x />
      <w-xse>
        <button className="btn btn-soft">Default</button>
        <button className="btn btn-soft btn-primary">Primary</button>
        <button className="btn btn-soft btn-secondary">Secondary</button>
        <button className="btn btn-soft btn-accent">Accent</button>
        <button className="btn btn-soft btn-info">Info</button>
        <button className="btn btn-soft btn-success">Success</button>
        <button className="btn btn-soft btn-warning">Warning</button>
        <button className="btn btn-soft btn-error">Error</button>
      </w-xse>

      <br-x />
      <br-x />
      <w-xse>
        <button className="btn btn-outline">Default</button>
        <button className="btn btn-outline btn-primary">Primary</button>
        <button className="btn btn-outline btn-secondary">Secondary</button>
        <button className="btn btn-outline btn-accent">Accent</button>
        <button className="btn btn-outline btn-info">Info</button>
        <button className="btn btn-outline btn-success">Success</button>
        <button className="btn btn-outline btn-warning">Warning</button>
        <button className="btn btn-outline btn-error">Error</button>
      </w-xse>



      <br-x />
      <br-x />
      <w-xse>
        <button className="btn btn-dash">Default</button>
        <button className="btn btn-dash btn-primary">Primary</button>
        <button className="btn btn-dash btn-secondary">Secondary</button>
        <button className="btn btn-dash btn-accent">Accent</button>
        <button className="btn btn-dash btn-info">Info</button>
        <button className="btn btn-dash btn-success">Success</button>
        <button className="btn btn-dash btn-warning">Warning</button>
        <button className="btn btn-dash btn-error">Error</button>
      </w-xse>
      <br-x />
      <br-x />
      <br-x />

      <w-cse>

        <div className="dropdown dropdown-start">
          <div tabIndex={0} role="button" className="btn m-1  font-normal" style={{ fontWeight: 100 }}>دراپ داون ⬇️</div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li><a>گزینه اول</a></li>
            <li><a>گزینه دوم</a></li>
          </ul>
        </div>



        <button className="btn btn-primary font-normal" onClick={() => { refresh({ modal2: true }) }}>مودال عادی</button>
        {props.modal2 ? <div className="modal modal-open" role="dialog" onClick={() => { refresh({ modal2: false }) }}>
          <div className="modal-box">
            <h3 className="text-lg font-bold">درود بر شما</h3>
            <p className="py-4">این یک پیغام از سمت کیو ای است</p>
          </div>
          <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
        </div> : null}



        <button className="btn btn-dash  font-normal" onClick={() => { refresh({ modal1: true }) }}>مودال دکمه دار</button>
        {props.modal1 ? <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">درود بر شما</h3>
            <p className="py-4">این یک پیغام از سمت کیو ای است</p>
            <div className="modal-action">
              <button className="btn" onClick={() => { refresh({ modal1: false }) }}>بستن</button>
            </div>
          </div>
        </div> : null}

      </w-cse>

      <br-x />
      <br-x />
      <a href="https://mui.com/material-ui/material-icons/" target='_blank'><div className="divider">آیکون ها (برای مشاهده لیست کلیک کنید)</div></a>
      <br-x />
      <br-x />
      <w-cse style={{ gap: 10 }}>
        <AddReactionIcon sx={{ fontSize: 40, color: "#2E951E" }} />
        <AccountBalanceIcon sx={{ fontSize: 35, color: "#1E4895" }} />
        <BuildIcon sx={{ fontSize: 30, color: "#951E85" }} />
        <BusinessCenterIcon sx={{ fontSize: 30, color: "#00AC98" }} />
        <CameraAltIcon sx={{ fontSize: 30, color: "#971D1D" }} />
        <AppRegistrationIcon sx={{ fontSize: 30 }} />
        <AlbumIcon sx={{ fontSize: 30 }} />
        <ApprovalIcon sx={{ fontSize: 30 }} />
        <AnnouncementIcon sx={{ fontSize: 30 }} />
        <CheckCircleOutlineIcon sx={{ fontSize: 30 }} />
        <CheckCircleIcon sx={{ fontSize: 30 }} />
        <CreateIcon sx={{ fontSize: 30 }} />
        <DangerousIcon sx={{ fontSize: 30 }} />




      </w-cse>


      <br-x />
      <br-x />
      <a href="https://daisyui.com/components/list/" target='_blank'><div className="divider">لیست (برای رفرنس کلیک کنید)</div></a>
      <br-x />
      <br-x />


      <w-cc>
        <ul className="list bg-base-100 rounded-box shadow-md" style={{ width: "100%" }}>

          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">بیشترین تعداد پخش در ماه گذشته</li>

          <li className="list-row">
            <div className="text-4xl font-thin opacity-30 tabular-nums">01</div>
            <div><img className="size-10 rounded-box" src="https://cdn.ituring.ir/qeupload/635111b8ff61db2b04928f49/siavashwebp-4s0z7pnjtj3epsgzgdrv5jekyexhan.webp" /></div>
            <div className="list-col-grow">
              <div>سیاوش قمیشی</div>
              <div className="text-xs uppercase opacity-60">قصه گل و تگرگ</div>
            </div>
            <button className="btn btn-square btn-ghost">
              <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
            </button>
          </li>

          <li className="list-row">
            <div className="text-4xl font-thin opacity-30 tabular-nums">02</div>
            <div><img className="size-10 rounded-box" src="https://cdn.ituring.ir/qeupload/635111b8ff61db2b04928f49/haydehdidarjpg-po2b1o5vvgffhn4cp1gtnulreqc63a.jpg" /></div>
            <div className="list-col-grow">
              <div>هایده</div>
              <div className="text-xs uppercase font-semibold opacity-60">شب عشق</div>
            </div>
            <button className="btn btn-square btn-ghost">
              <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
            </button>
          </li>

          <li className="list-row">
            <div className="text-4xl font-thin opacity-30 tabular-nums">03</div>
            <div><img className="size-10 rounded-box" src="https://cdn.ituring.ir/qeupload/635111b8ff61db2b04928f49/jpg-i3k3k83fb8ipmmzaqpddnvdyy90qpy.jpg" /></div>
            <div className="list-col-grow">
              <div>ابی</div>
              <div className="text-xs uppercase font-semibold opacity-60">گریز</div>
            </div>
            <button className="btn btn-square btn-ghost">
              <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
            </button>
          </li>

        </ul>
      </w-cc>


      <br-x />
      <br-x />
      <a href="https://daisyui.com/components/steps/" target='_blank'><div className="divider">گام استپ (برای رفرنس کلیک کنید)</div></a>

      <br-x />
      <br-x />

      <w-cc>
        <ul className="steps">
          <li className="step step-primary">ثبت نام</li>
          <li className="step step-primary">انتخاب پلان</li>
          <li className="step">خرید</li>
          <li className="step">دریافت محصول</li>
        </ul>
      </w-cc>

      <br-x />
      <br-x />
      <a href="https://mui.com/x/react-charts/" target='_blank'><div className="divider">چارت (برای رفرنس کلیک کنید)</div></a>
      <br-x />
      <br-x />

      <w-cc style={{ direction: "ltr" }}>
        <f-x>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: 'series A' },
                  { id: 1, value: 15, label: 'series B' },
                  { id: 2, value: 20, label: 'series C' },
                ],
              },
            ]}
            width={150}
            height={150}
          />
        </f-x>
        <f-x>
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
                area: true,
              },
            ]}
            width={300}
            height={200}
          />
        </f-x>
        <f-x>
          <RadarChart
            height={250}
            series={[{ label: 'Habib', data: [120, 98, 86, 99, 85, 65] }]}
            radar={{
              max: 120,
              metrics: ['Math', 'Chinese', 'English', 'Geography', 'Physics', 'History'],
            }}
          />
        </f-x>
      </w-cc>


      <br-x />
      <br-x />
      <a href="https://daisyui.com/components/card/" target='_blank'><div className="divider">کارت (برای رفرنس کلیک کنید)</div></a>
      <br-x />
      <br-x />

      <w-cse>
        <div className="card bg-base-100 image-full w-96 shadow-sm">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">کفش اسپورت آدیداس</h2>
            <p>دارای تهویه عالی، بسیار نرم و قابل انعطاف در عین زیبایی و استحکام</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary" style={{ fontWeight: 100 }}>خرید</button>
            </div>
          </div>
        </div>

      </w-cse>


      <br-x />
      <br-x />
      <a href="https://t.me/c/2051156569/27382/28062" target='_blank'><div className="divider">تعدادی از تگ های سفارشی (برای رفرنس تلگرام کلیک کنید)</div></a>
      <br-x />
      <br-x />

      <w-cse style={{ gap: 10 }}>
        <c-c class="shadow-md" style={{ backgroundColor: "white", width: 150, height: 150, borderRadius: 5 }}>
          <f-12>f-s</f-12>
          <f-s style={{ height: 130, width: "90%" }}>
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
          </f-s>
        </c-c>

        <c-c class="shadow-md" style={{ backgroundColor: "white", width: 150, height: 150, borderRadius: 5 }}>
          <f-12>f-e</f-12>
          <f-e style={{ height: 130, width: "90%" }}>
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
          </f-e>
        </c-c>

        <c-c class="shadow-md" style={{ backgroundColor: "white", width: 150, height: 150, borderRadius: 5 }}>
          <f-12>f-ec</f-12>
          <f-ec style={{ height: 130, width: "90%" }}>
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
          </f-ec>
        </c-c>


        <c-c class="shadow-md" style={{ backgroundColor: "white", width: 150, height: 150, borderRadius: 5 }}>
          <f-12>f-cc</f-12>
          <f-cc style={{ height: 130, width: "90%" }}>
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
          </f-cc>
        </c-c>


        <c-c class="shadow-md" style={{ backgroundColor: "white", width: 150, height: 150, borderRadius: 5 }}>
          <f-12>c-c</f-12>
          <c-c style={{ height: 130, width: "90%" }}>
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
          </c-c>
        </c-c>

        <c-c class="shadow-md" style={{ backgroundColor: "white", width: 150, height: 150, borderRadius: 5 }}>
          <f-12>c-cc</f-12>
          <c-cc style={{ height: 130, width: "90%" }}>
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
            <f-c style={{ backgroundColor: "green", borderRadius: 10, height: 10, width: 10 }} />
          </c-cc>
        </c-c>



      </w-cse>





      <br-x />
      <br-x />
      <a href="https://daisyui.com/components/tab/" target='_blank'><div className="divider">تب (برای رفرنس کلیک کنید)</div></a>
      <br-x />
      <br-x />

      <w-cse>
        <f-cc class="shadow-md" style={{ padding: 20, backgroundColor: "white", borderRadius: 5 }}>
          <div className="tabs tabs-box">
            <input type="radio" name="my_tabs_1" className="tab" aria-label="تب اول" />
            <input type="radio" name="my_tabs_1" className="tab" aria-label="تب دوم" defaultChecked />
            <input type="radio" name="my_tabs_1" className="tab" aria-label="تب سوم" />
          </div>
        </f-cc>
        <f-cc class="shadow-md" style={{ padding: 20, backgroundColor: "white", borderRadius: 5 }}>
          <div className="tabs tabs-lift">
            <label className="tab">
              <input type="radio" name="my_tabs_4" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
              سلامت
            </label>
            <div className="tab-content bg-base-100 border-base-300 p-6">محتوای اول</div>

            <label className="tab">
              <input type="radio" name="my_tabs_4" defaultChecked />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>
              سرگرمی
            </label>
            <div className="tab-content bg-base-100 border-base-300 p-6">محتوای دوم</div>

            <label className="tab">
              <input type="radio" name="my_tabs_4" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 me-2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
              داستانی
            </label>
            <div className="tab-content bg-base-100 border-base-300 p-6">محتوای سوم</div>
          </div>
        </f-cc>

      </w-cse>



      <br-x />
      <br-x />
      <a href="https://daisyui.com/components/checkbox/" target='_blank'><div className="divider">چک باکس (برای رفرنس کلیک کنید)</div></a>
      <br-x />
      <br-x />

      <w-cc style={{ gap: 30 }}>
        <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
        <input type="checkbox" defaultChecked className="checkbox checkbox-secondary" />
        <input type="checkbox" defaultChecked className="checkbox checkbox-accent" />
        <input type="checkbox" defaultChecked className="checkbox checkbox-neutral" />
        <input type="checkbox" defaultChecked className="checkbox checkbox-info" />
        <input type="checkbox" defaultChecked className="checkbox checkbox-success" />
        <input type="checkbox" defaultChecked className="checkbox checkbox-warning" />
        <input type="checkbox" defaultChecked className="checkbox checkbox-error" />
      </w-cc>

      <br-x />
      <br-x />
      <a href="https://daisyui.com/components/radio/" target='_blank'><div className="divider">رادیو باتن ها (برای رفرنس کلیک کنید)</div></a>
      <br-x />
      <br-x />

      <w-cc style={{ gap: 30 }}>
        <input type="radio" checked={props.radionum == 0} className="radio radio-primary" onChange={e => { if (e.currentTarget.checked) { refresh({ radionum: 0 }) } }} />
        <input type="radio" checked={props.radionum == 1} className="radio radio-secondary" onChange={e => { if (e.currentTarget.checked) { refresh({ radionum: 1 }) } }} />
        <input type="radio" checked={props.radionum == 3} className="radio radio-accent" onChange={e => { if (e.currentTarget.checked) { refresh({ radionum: 3 }) } }} />
        <input type="radio" checked className="radio radio-neutral" />
        <input type="radio" checked className="radio radio-info" />
        <input type="radio" checked className="radio radio-success" />
        <input type="radio" checked className="radio radio-warning" />
        <input type="radio" checked className="radio radio-error" />
      </w-cc>

      <br-x />
      <br-x />
      <a href="https://daisyui.com/components/range/" target='_blank'><div className="divider">رنج (برای رفرنس کلیک کنید)</div></a>
      <br-x />
      <br-x />
      <w-cse style={{ gap: 10 }}>
        <input type="range" min={0} max="100" value={props.rangevalue} className="range range-primary" onChange={(e) => {
          refresh({ rangevalue: e.currentTarget.value })
        }} />



        <div className="w-full max-w-xs">
          <input type="range" min={0} max="100" value={props.range2value} className="range" step="25"
            onChange={(e) => {
              refresh({ range2value: e.currentTarget.value })
            }} />
          <div className="flex justify-between px-2.5 mt-2 text-xs">
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
          </div>
          <div className="flex justify-between px-2.5 mt-2 text-xs">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>


      </w-cse>

      <br-x />
      <br-x />
      <a href="https://daisyui.com/components/toggle/" target='_blank'><div className="divider">توگل ها (برای رفرنس کلیک کنید)</div></a>

      <br-x />
      <br-x />

      <w-cse style={{ gap: 40 }}>
        <input type="checkbox" defaultChecked className="toggle toggle-primary" />
        <input type="checkbox" defaultChecked className="toggle toggle-secondary" />
        <input type="checkbox" defaultChecked className="toggle toggle-accent" />
        <input type="checkbox" defaultChecked className="toggle toggle-neutral" />

        <input type="checkbox" defaultChecked className="toggle toggle-info" />
        <input type="checkbox" defaultChecked className="toggle toggle-success" />
        <input type="checkbox" defaultChecked className="toggle toggle-warning" />
        <input type="checkbox" defaultChecked className="toggle toggle-error" />
      </w-cse>

      <br-x />
      <br-x />
      <a href="https://t.me/c/2051156569/27382/28089" target='_blank'><div className="divider">پرچم ها (برای رفرنس کلیک کنید)</div></a>
      <br-x />
      <br-x />

      <w-cse style={{ gap: 40 }}>
        <Flag ccode='ir' on={() => { }} style={{ width: 30 }} />‌
        <Flag ccode='us' on={() => { }} style={{ width: 30 }} />‌
        <Flag ccode='gb' on={() => { }} style={{ width: 30 }} />‌
        <Flag ccode='mx' on={() => { }} style={{ width: 30 }} />‌
        <Flag ccode='ru' on={() => { }} style={{ width: 30 }} />‌
        <Flag ccode='eg' on={() => { }} style={{ width: 30 }} />‌
        <Flag ccode='cn' on={() => { }} style={{ width: 30 }} />‌
        <Flag ccode='pt' on={() => { }} style={{ width: 30 }} />‌
        <Flag ccode='fr' on={() => { }} style={{ width: 30 }} />‌
      </w-cse>


      <br-x />
      <br-x />
      <a href="https://t.me/c/2051156569/27382/28089" target='_blank'> <div className="divider">پجینیشن (شماره صفحات) برای رفرنس کلیک کنید</div></a>
      <br-x />
      <br-x />

      <w-cc style={{ gap: 30 }}>

        <div className="join">
          <input
            className="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label="1"
            checked />
          <input className="join-item btn btn-square" type="radio" name="options" aria-label="2" />
          <input className="join-item btn btn-square" type="radio" name="options" aria-label="3" />
          <input className="join-item btn btn-square" type="radio" name="options" aria-label="4" />
        </div>


        <div className="join">
          <button className="join-item btn">1</button>
          <button className="join-item btn">2</button>
          <button className="join-item btn btn-disabled">...</button>
          <button className="join-item btn">99</button>
          <button className="join-item btn">100</button>
        </div>
      </w-cc>
    </Window>

    <Window title="کامپوننت های کیو ای">


      <br-xx />
      <b-200 style={{ backgroundColor: "#748EC5" }}>
        زمان باقی مانده :
        <sp-3 />
        {RemainingTime(new Date(), new Date(new Date().getTime() - 3 * 3600000), z.lang.code)}
      </b-200>


      <br-xx />
      <b-200 style={{ backgroundColor: "#748EC5" }}>اختصار انتهای متن: <sp-2 />
        {TextEndAbbreviation(`لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم
           از صنعت چاپ و با استفاده از طراحان گرافیک است.`, 30)}
      </b-200>


      <br-xx />
      <b-200 style={{ backgroundColor: "#748EC5" }}>اختصار وسط متن: <sp-2 />
        {TextMidAbbreviation(`لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم 
          از صنعت چاپ و با استفاده از طراحان گرافیک است.`, 30)}
      </b-200>

      <br-xx />
      <b-200 style={{ backgroundColor: "#748EC5", fontSize: 12 }}>
        جایگزین کننده:
        <sp-3 />
        {ReplacePro(
          "این تصویر IMAGE مربوط به کلوز است",
          "IMAGE",
          <img src={cdn("/files/close.svg")} style={{ width: 15, marginLeft: 5, marginRight: 5 }} />)}
      </b-200>

      <br-xx />
      <b-200 style={{ backgroundColor: "#748EC5" }}>
        شمارنده معکوس
        <sp-2 />
        <CountDown expdate={new Date(new Date().getTime() + 30000)}
          onexpire={() => { console.log("expired!") }} />
      </b-200>

      <br-xx />
      <b-200 style={{ backgroundColor: "#748EC5" }}>
        شماره فارسی
        <sp-2 />
        {FaDigits("09175465451")}
      </b-200>


      <br-xx />
      <b-200 style={{ backgroundColor: "#748EC5" }}>
        شماره انگلیسی
        <sp-2 />
        {EnDigits("۱۲۳۴۵")}
      </b-200>

      <br-xx />
      <b-200 style={{ backgroundColor: "#748EC5" }}>
        عدد فارسی با جدا کننده
        <sp-2 />
        {(123456).toLocaleString("fa-IR")}
      </b-200>


      <br-xx />
      <b-200 style={{ backgroundColor: "#748EC5" }}>
        عدد انگلیسی با جدا کننده
        <sp-2 />
        {(123456).toLocaleString("en-US")}
      </b-200>

      <br-xx />
      <b-200 style={{ backgroundColor: "#748EC5" }} >
        عدد مطابق با زبان صفحه + جدا کننده
        <sp-2 />
        {(123456).toLocaleString(z.lang.region)}
      </b-200>

      <br-xx />
      <b-200 style={{ backgroundColor: "#748EC5" }}>
        <f-12>تاریخ و زمان کامل (لوکال): </f-12> <sp-2 />
        {ToLocaleDateTime(new Date())}
      </b-200>

      <br-xx />
      <b-200 style={{ backgroundColor: "#748EC5" }}>
        <f-12>نشان بج مارک
          <sp-2 />
          <Badge verify="owner" /> <sp-2 />
          <Badge verify="admin" /> <sp-2 />
          <Badge verify="anythingelse.." /> <sp-2 />
        </f-12>
      </b-200>


      <br-xx />
      <b-200 style={{ backgroundColor: "#748EC5" }}>
        <HandRankExplore item={props.item1} refresh={refresh} z={z} ondislike={() => { }} onlike={() => { }} />
        <sp-2 />
        لایک و دیسلایک
      </b-200>


      <br-xx />
      <b-200 style={{ backgroundColor: "#748EC5" }}>
        <HandRankExplore item={props.item2} refresh={refresh} z={z} ondislike={() => { }} onlike={() => { }} />
        <sp-2 />
        لایک و دیسلایک
      </b-200>

      <br-x />
      <Window title='هشتگ تکی و دوبل + پنجره سفارشی' contentbgcolor='#C0D2BD' titlebgcolor='#A9AB42'
        contentStyle={{ padding: 5 }} style={{ margin: 5 }}>
        {LinkHashtags(`Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, et 
        vero enim reprehenderit #AbbreviateDate veritatis ##AbbreviateDate, nostrum, vel commodi quasi 
        quaerat tenetur necessitatibus dolore illo harum. Harum dicta est tenetur?`, "test",
          {
            ondouble: (tag) => { console.log(`on double:${tag}`) },
            onsingle: (tag) => { console.log(`on single:${tag}`) },
            singleprelink: z.root + "/examples/",
            doubleprelink: z.root + "/examples/",
          })}
      </Window>



      <br-xx />
      <Window title="آواتار کاربر" style={{ backgroundColor: "#748EC5", minHeight: 60 }}>
        <w-cse style={{ padding: 20, rowGap: 50 }}>
          <UserAvatar image={z.middleuser.image} width={50} />
          <UserAvatar image={z.middleuser.image} width={45} />
          <UserAvatar image={z.middleuser.image} width={40} />
          <UserAvatar image={z.middleuser.image} width={35} />
          <UserAvatar image={z.middleuser.image} width={30} />
          <UserAvatar image={z.middleuser.image} width={25} />
        </w-cse>
      </Window>



      <br-xx />
      <Window title="پروگرس سیرکولار" contentbgcolor='#C8D3A4' contentStyle={{ padding: 15 }}>
        <w-cse style={{ gap: 10 }}>
          <Circle percent={58} width={50} />
          <Circle percent={58} width={50} />
          <Circle percent={100} width={30} />
          <Circle percent={58} width={30} />
        </w-cse>
      </Window>



      <Window title='آیتم های وی'>
        <w-cc style={{ gap: 10, padding: 20 }}>
          <VItem image={cdn("/files/app/node.webp")} title={"نود جی اس"} selected
            on={() => { alerter("شما آیتم نود جی اس را انتخاب کردید") }} />
          <VItem image={cdn("/files/app/reload.webp")} title={"ریلود"} on={() => { alerter("شما ریلود را انتخاب کردید") }} />
          <VItem image={cdn("/files/app/plug.webp")} title={"پلاگ"} />
          <VItem image={cdn("/files/app/start.webp")} title={"استارت"} bold icon2={cdn("/files/ok.svg")} selected/>
          <VItem image={cdn("/files/app/sender2.webp")} title={"ارسال"} />
          <VItem image={cdn("/files/app/workers.webp")} title={"ورکرها"} />
          <VItem image={cdn("/files/app/translate.webp")} title={"ترجمه"} />
        </w-cc>
      </Window>

      <br-xx />
      <Window title='امتیاز دهی ستاره ای' contentStyle={{ minHeight: 50, padding: 10 }}>

        <f-cse>
          <c-cc>
            <StarRating stars={props.stars1 || 0} on={(num) => { props.stars1 = num; refresh() }} id='star_test1' />
            <StarRating stars={props.stars1 || 0} on={(num) => { refresh({ stars1: num }) }} id='star_test2' width={20} />
            <StarRating stars={props.stars1 || 0} on={(num) => { refresh({ stars1: num }) }} id='star_test3' width={15} />
          </c-cc>

          <c-cc>
            <StarRating stars={props.stars2 || 0} on={(num) => { refresh({ stars2: num }) }} id='star_test4' />
            <StarRating stars={props.stars2 || 0} on={(num) => { refresh({ stars2: num }) }} id='star_test5' width={20} />
            <StarRating stars={props.stars2 || 0} on={(num) => { refresh({ stars2: num }) }} id='star_test6' width={15} />
          </c-cc>

        </f-cse>
      </Window>



      <br-xx />
      <DropDown id="test" title='متن باز شونده' key={"test"} state={props.isddopen} titlebgcolor='#75B058' contentbgcolor='#A7C0C4'>
        {Lorem}
      </DropDown>


      <br-x />
      <OpeningTitle name='service' id={"test"} onflip={(o) => { props.opendetail = o; refresh() }}>
        <Icon3Titles
          title1={"آیتم باز شونده"}
          title2={<f-12 style={{ marginTop: 5 }}>عنوان دوم</f-12>}
          title3={<f-12 style={{ marginTop: 5 }}>عنوان سوم</f-12>}
          icon={cdn("/files/app/accountmngr.webp")}
          roundicon
          style={{ backgroundColor: "#B2C0D2", minHeight: 75 }}
          special={"special"}
          specialcolor={"green"} />
      </OpeningTitle>


      <OpeningDetail open={props.opendetail} name='service' id={"test"} >
        <div style={{ backgroundColor: "#80B07D" }}>{Lorem}</div>
      </OpeningDetail>





      <br-xx />
      <Icon2Titles
        title1={"عنوان اول"}
        title2={"عنوان دوم"}
        icon={cdn("/files/app/close.webp")}
        style={{ backgroundColor: "#9CB99B" }}
        on={() => { alerter("Clicked on Icon2Titles") }}
      />


      <br-xx />
      <Icon2Titles
        title1={<f-13>{"عنوان سفارشی"}</f-13>}
        title2={<f-10>{"عنوان دوم سفارشی"}</f-10>}
        icon={<img src={cdn("/files/app/trader.webp")} style={{ width: 30 }} />}
        style={{ backgroundColor: "#A3D7AE" }}
        on={() => { alerter("Clicked on Icon2Titles") }} />


      <br-xx />
      <Icon3Titles
        title1={"عنوان اول"}
        title2={"عنوان دوم"}
        title3={"عنوان سوم"}
        icon={cdn("/files/app/gpt.webp")}
        style={{ backgroundColor: "#9BB3B9" }}
        on={() => { alerter("Clicked on Icon3Titles") }}
      />


      <br-xx />
      <Icon3Titles
        title1={"عنوان اول"}
        title2={<f-12 style={{ color: "blue" }}>عنوان دوم سفارشی</f-12>}
        title3={"عنوان سوم"}
        icon={cdn("/files/app/qedesk.webp")}
        style={{ backgroundColor: "#A09EC9" }}
        on={() => { alerter("Clicked on Icon3Titles") }}
      />



      <br-xx />
      <Window title='متن تکه ای' contentStyle={{ minHeight: 50, padding: 10 }}>
        <Text
          title='نمره شما:'
          nospace
          value={(20).toLocaleString(z.lang.region)}
          wlink='ویرایش'
          whighlight
          onwlink={() => { alerter("قابل ویرایش نیست") }}
        />
      </Window>


      <br-xx />
      <Window title='تکست باکس قیمت' contentStyle={{ minHeight: 100, padding: 10 }}>
        <PriceTextBox fractions={1} title='لطفا مبلغ مورد نظر را وارد کنید' defaultValue={"100.26"} unit='تومان'
          on={() => { }} explainstr='مراقب باشید' explain={"مراقبت"} readOnly lefticon={cdn("/files/ok.svg")} onlefticon={() => { }}
          righttext={"hiiii"} />
      </Window>


      <br-xx />
      <Window title='جست و جو' contentStyle={{ minHeight: 100, padding: 10 }}>
        <Search
          title='جست و جو در میان گزینه ها'
          defaultValue={props.search}
          on={(txt) => { props.search = txt; refresh(); alerter("جست و جو به دنبال:" + txt) }}
          onclose={() => { refresh({ search: "" }) }}
        />
      </Window>


      <br-xx />
      <Window title='TextArea' contentStyle={{ minHeight: 50, padding: 10 }}>
        <TextArea on={(txt) => { props.txtareamsg = txt; }} title='متن را وارد کنید:' placeholder='پیام شما' />
        <b-200 style={{ backgroundColor: "#66AE7D" }} onClick={() => { alerter(props.txtareamsg) }}>بازبینی</b-200>
      </Window>


      <br-x />
      <br-x />
      <br-x />
    </Window>

  </div>
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  var session = await ((await import('@/backend/SSRVerify.ts')).SSRVerify)(context, false, [])

  let obj = await Prosper({
    props: {      
      session,
      title: "test title",
      description: "test description",
      
    },
  }, context)

  return obj
}


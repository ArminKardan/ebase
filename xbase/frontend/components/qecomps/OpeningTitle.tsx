import { SSRGlobal } from "./Context";

export default (props) => {
  let z = SSRGlobal();
  var toggleThin1 = () => {
    var em = document.getElementById(props.name + '_detail_' + props.id);
    var temp = window.getComputedStyle(em).getPropertyValue("max-height");
    if (temp == "0px") {
      props.onflip(true)
      setTimeout(() => {
        closeAllOtherThins(props.name + '_detail_' + props.id);
      }, 1200);
      document.getElementById(props.name + '_detail_' + props.id).className = z.qestyles.openheight;
      return true
    }
    else {

      document.getElementById(props.name + '_detail_' + props.id).className = z.qestyles.closeheight;
      setTimeout(() => {
        props.onflip(false)
      }, 300);
      return false;
    }
  }

  var closeAllOtherThins = (except) => {
    var els = document.getElementsByTagName("div");
    Array.from(els).forEach(el => {
      var id = el.getAttribute("id");
      if (id) {
        if (id.includes(props.name + "_detail_")) {
          if (id != except) {
            el.className = z.qestyles.fastcloseheight
          }
        }
      }
    });
  }

  let el = null
  return <div onClick={async (e) => {

    // await sleep(400)
    props.onclick?.();
    let open = toggleThin1();


    if (open) {
    document.getElementById(props.id + "_scroller").scrollIntoView({ behavior: "smooth", block: "start" })

      setTimeout(() => {
        document.getElementById(props.id + "_scroller").scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100);
      //   setTimeout(() => {
      //     document.getElementById(props.id + "_scroller").scrollIntoView({ behavior: "smooth", block: "start" })
      //   }, 200);
      //   setTimeout(() => {
      //     document.getElementById(props.id + "_scroller").scrollIntoView({ behavior: "smooth", block: "start" })
      //   }, 300);
      //   setTimeout(() => {
      //     document.getElementById(props.id + "_scroller").scrollIntoView({ behavior: "smooth", block: "start" })
      //   }, 400);
      let c = setInterval(() => {
        document.getElementById(props.id + "_scroller").scrollIntoView({ behavior: "smooth", block: "start" })
      }, 50);
      setTimeout(() => {
        clearInterval(c)
      }, 1000);

    }


    // if (props.savescroll) {
    //   setTimeout(() => {
    // document.getElementById(props.id + "_scroller").scrollIntoView({ behavior: "smooth", block: "start" })

    //     // var element = document.getElementById(props.id + "_scroller")
    //     //   var headerOffset = 10;
    //     //   var elementPosition = element.getBoundingClientRect().top;
    //     //   var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    //     //   global.parentdiv.scrollTo({
    //     //        top: offsetPosition,
    //     //        behavior: "smooth"
    //     //   });

    //   }, 400);
    // }

  }}  >
    <div id={props.id + "_scroller"}></div>
    {props.children}
  </div>
}
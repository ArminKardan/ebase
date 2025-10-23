import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export default (props: {} & { [key: string]: any }) => {
    if (typeof window === "undefined") return <></>;

    const slides = props.slides || [];
    const auto = props.auto !== false; // defaults to true unless explicitly false

    if (!document.getElementById("slider-style")) {
        const style = document.createElement("style");
        style.id = "slider-style";
        style.innerHTML = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .slider-container {
          width: ${props.width || "800px"};
          max-width: 100vw;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.25);
      }
      .slider { position: relative; height: ${props.height || "450px"}; overflow: hidden; }
      .slide { position: absolute; top:0; left:0; width:100%; height:100%; opacity:0; transition:opacity 0.6s ease; z-index:1; }
      .slide.active { opacity:1; z-index:2; }
      .slide img { width:100%; height:100%; object-fit:cover; } /* Removed zoom effect */
      .slide-content {
          position:absolute; bottom:0; left:0; width:100%; padding:20px;
          background:linear-gradient(transparent,rgba(0,0,0,0.6)); color:white;
          transform:translateY(100%); opacity:0; transition:transform 0.6s ease, opacity 0.5s ease;
      }
      .slide.active .slide-content { transform:translateY(0); opacity:1; transition-delay:0.3s; }
      .slide-title { font-size:1.5rem; margin-bottom:6px; }
      .slide-description { font-size:1rem; opacity:0.9; }
      .navigation { position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:20; }
      .nav-btn {
          position:absolute; top:50%; transform:translateY(-50%);
          background:rgba(255,255,255,0.8); color:#111;
          border:none; border-radius:50%; width:45px; height:45px;
          display:flex; align-items:center; justify-content:center;
          pointer-events:auto; cursor:pointer; transition:all 0.3s ease;
      }
      .nav-btn.prev { left:15px; }
      .nav-btn.next { right:15px; }
      .nav-btn:hover { background:rgba(255,255,255,1); transform:translateY(-50%) scale(1.1); }
      .dots-container { display:flex; justify-content:center; position:absolute; bottom:20px; width:100%; z-index:10; }
      .dot {
          width:10px; height:10px; border-radius:50%; margin:0 5px;
          background-color:rgba(255,255,255,0.5); cursor:pointer;
          transition:all 0.3s ease;
      }
      .dot.active { background-color:white; transform:scale(1.2); }
    `;
        document.head.appendChild(style);
    }

    if (!(window as any).__sliderSetupDone) {
        (window as any).__sliderSetupDone = true;

        setTimeout(() => {
            const slider = document.querySelector(".slider");
            if (!slider) return;

            const slides = document.querySelectorAll(".slide");
            const prevBtn = document.querySelector(".prev");
            const nextBtn = document.querySelector(".next");
            const dotsContainer = document.querySelector(".dots-container");
            let currentIndex = 0;
            let autoSlide: any;
            const delay = 5000;

            slides.forEach((_, i) => {
                const dot = document.createElement("div");
                dot.classList.add("dot");
                if (i === 0) dot.classList.add("active");
                dot.addEventListener("click", () => showSlide(i));
                dotsContainer.appendChild(dot);
            });
            const dots = dotsContainer.querySelectorAll(".dot");

            function showSlide(i: number) {
                if (i < 0) i = slides.length - 1;
                if (i >= slides.length) i = 0;
                slides.forEach((s) => s.classList.remove("active"));
                dots.forEach((d) => d.classList.remove("active"));
                slides[i].classList.add("active");
                dots[i].classList.add("active");
                currentIndex = i;
                if (auto) resetAuto();
            }

            function next() {
                showSlide(currentIndex + 1);
            }
            function prev() {
                showSlide(currentIndex - 1);
            }

            function start() {
                if (auto) autoSlide = setInterval(next, delay);
            }
            function resetAuto() {
                clearInterval(autoSlide);
                start();
            }

            prevBtn.addEventListener("click", prev);
            nextBtn.addEventListener("click", next);

            if (auto) {
                slider.addEventListener("mouseenter", () => clearInterval(autoSlide));
                slider.addEventListener("mouseleave", start);
                start();
            }
        }, 100);
    }

    return (
        <div
            className="slider-container"
            style={{
                width: props.width || "800px",
                height: props.height || "500px",
            }}
        >
            <div className="slider">
                {slides.map((slide: any, i: number) => (
                    <div key={i} className={`slide ${i === 0 ? "active" : ""}`}>
                        <img src={slide.img} alt={`Slide ${i + 1}`} />
                        {(slide.title || slide.description) && (
                            <div className="slide-content">
                                {slide.title && <h2 className="slide-title">{slide.title}</h2>}
                                {slide.description && (
                                    <p className="slide-description">{slide.description}</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="navigation">
                <button className="nav-btn prev">
                    <ChevronLeft />
                </button>
                <button className="nav-btn next">
                    <ChevronRight />
                </button>
            </div>
            <div className="dots-container"></div>
        </div>
    );
};

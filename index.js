document.addEventListener("DOMContentLoaded", () => {
    const bt = document.querySelector('#center');
    const cursor = document.querySelector(".cursor")

    document.addEventListener("mousemove", (e) => {
        let x = e.pageX;
        let Y = e.pageY;
        cursor.style.top = Y + 'px';
        cursor.style.left = x + 'px';
        cursor.style.display = "block"

    })
    document.addEventListener("mouseout", () => {
        cursor.style.display = "none"
    })



    if (!bt) {
        console.error("Element with ID 'center' not found.");
        return;
    }

    const throttleFunction = (func, delay) => {
        let prev = 0;
        return (...args) => {
            let now = new Date().getTime();
            if (now - prev > delay) {
                prev = now;
                return func(...args);
            }
        }
    };

    bt.addEventListener("mousemove", throttleFunction((dets) => {

        var div = document.createElement("div")
        div.classList.add("imagediv");
        div.style.left = dets.clientX + 'px';
        div.style.top = dets.clientY + 'px';
        var img = document.createElement("img");
        img.setAttribute("scr", "logo.png")
        div.appendChild(img);

        document.body.appendChild(div)
        gsap.to(img, {
            y: "0",
            delay: .100,
            ease: Power1,
            duration: .2
        })
        gsap.to(img, {
            y: "100%",
            delay: .5,
            ease: Power2,
            duration: .5
        })
        setTimeout(function() {
            div.remove();
        }, 2000)

    }, 100));
});

document.addEventListener("DOMContentLoaded", () => {
    const scrollers = document.querySelectorAll(".scroller");

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        addAnimation();
    }

    function addAnimation() {
        scrollers.forEach((scroller) => {
            scroller.setAttribute("data-animated", true);
            const scrollerInner = scroller.querySelector(".scroller-inner");

            if (!scrollerInner) {
                console.error("No .scroller-inner found inside scroller:", scroller);
                return;
            }

            const scrollerContent = Array.from(scrollerInner.children);
            const totalItems = scrollerContent.length;

            // Duplicate the content enough times to ensure a seamless scroll
            for (let i = 0; i < 6; i++) { // Adjust the multiplier as needed
                scrollerContent.forEach((item) => {
                    const duplicatedItem = item.cloneNode(true);
                    duplicatedItem.setAttribute("aria-hidden", true);
                    scrollerInner.appendChild(duplicatedItem);
                });
            }

            // Adjust the width of the scrollerInner
            const itemWidth = scrollerContent[0].offsetWidth + 10; // including the column-gap
            scrollerInner.style.width = `${totalItems * 2 * itemWidth}px`;
            // Adjust animation duration based on total width to ensure smoothness


        });
    }
});
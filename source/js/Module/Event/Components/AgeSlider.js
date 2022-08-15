import { parse } from "uuid";

// Frontend logic to sync numbers with slides
const sliderFunc = () => {
    const parent = document.querySelector('.age-slider')

    if(!parent) {
        return;
    }

    const rangeS = parent.querySelectorAll('input[type="range"]'), 
        numberS = parent.querySelectorAll('input[type="number"]');

    rangeS.forEach((el) => {
        el.oninput = () => {
            let slide1 = parseFloat(rangeS[0].value), slide2 = parseFloat(rangeS[1].value);

            if (slide1 > slide2) {
                [slide1, slide2] = [slide2, slide1]
            }

            numberS[0].value = slide1;
            numberS[1].value = slide2;
        }
    });

    numberS.forEach((el) => {
        el.oninput = () => {
            let number1 = parseFloat(numberS[0].value), number2 = parseFloat(numberS[1].value);

            if (number1 > number2) {
                let tmp = number1;
                numberS[0].value = number2;
                numberS[1].value = tmp
            }

            rangeS[0].value = number1;
            rangeS[1].value = number2;
        };
    })

};

// Change minValue and maxValue on slide
const onSlide = () => {
    let minValue = document.getElementById("minValue").value;
    console.log("minValue: ", minValue);

    let maxValue = document.getElementById("maxValue").value;
    console.log("maxValue: ", maxValue);
}


export default function AgeSlider ( { translation, onAgeChange, ageRange, } ) {
    sliderFunc();
    
    return (
        <div className="age-slider-container">
            <p className="title"> {translation.selectAge} </p>
            <div className="age-slider">
                <span>
                     {" "} min <input type="number" defaultValue="1" min="1" max="100" step="1" onChange={onSlide}/> 
                     {" "} max <input type="number" defaultValue="100" min="1" max="100" step="1" onChange={onSlide} />
                </span>

                <input id="minValue" defaultValue="1" min="1" max="100" step="1" type="range" onChange={onSlide} />
                <input id="maxValue" defaultValue="100" min="1" max="100" step="1" type="range" onChange={onSlide} />
            </div>
        </div>

    )
}
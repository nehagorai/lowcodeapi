const color = {
    'default': 'bg-gray text-gray-700 font-semibold uppercase ',
    "200" : "bg-green text-green-700 font-semibold uppercase ",
    "301" : "bg-yellow text-yellow-600 font-semibold uppercase ",
    "400" : "bg-orange text-orange-600 font-semibold uppercase ",
    "500" : "bg-red text-red-800 font-semibold uppercase ",
}

const text = {
    "200" : "200",
    "201" : "200",
    "204" : "200",
    "301" : "301",
    "301" : "301",
    "400" : "400",
    "401" : "400",
    "402" : "400",
    "404" : "400",
    "422" : "400",
    "429" : "500",
    "500" : "500",
    "501" : "500",
    "502" : "500",
}

const label = (name) => {

    return <span title={`${name}`}>{text[name]}</span>;
}

function StatusCodeColor({ code, className, w = 'w-16', clip }) {

    return (
        <span className={className ? className: `${w} text-center font-bold ${color[text[code]]}`}>
        {code}
        </span>
    )
}

const method = color;
export default StatusCodeColor;

export { method };
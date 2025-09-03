const color = {
    'default': 'bg-gray text-gray-700 font-semibold uppercase ',
    "GET" : "bg-green text-green-700 font-semibold uppercase ",
    "POST" : "bg-yellow text-yellow-600 font-semibold uppercase ",
    "PATCH" : "bg-orange text-orange-600 font-semibold uppercase ",
    "PUT" : "bg-purple text-purple-700 font-semibold uppercase ",
    "DELETE" : "bg-red text-red-800 font-semibold uppercase ",
}

const label = (name) => {
    const text = {
        "GET" : "GET",
        "POST" : "POST",
        "PATCH" : "PATCH",
        "PUT" : "PUT",
        "DELETE" : "DEL",
    }   

    return <span title={`${name}`}>{text[name]}</span>;
}

function HTTPMethodLabel({ name, className, w = 'w-16', clip = false }) {

    return (
        <span className={className ? className: `${w} text-center font-bold ${color[name.toUpperCase()] || color.GET}`}>
        {
            clip ?  label(name.toUpperCase()) : name.toUpperCase()
        }
        
        </span>
    )
}

const method = color;
export default HTTPMethodLabel;

export { method };
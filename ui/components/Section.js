import React from "react"


const Section = ({ className,children }) => (
    <div className={`md:flex lg:px-6 px-4 pb-2 ${className}`}>
        {children}
    </div>)

export default Section



const sanitize = (category) => {
    return category.toString().toLowerCase().trim().replaceAll(':','').replaceAll('/','').split(' ').filter((i) => !!i).join('-');
}

export default sanitize;
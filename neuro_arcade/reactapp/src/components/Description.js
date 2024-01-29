
const Description = ({description}) => {
    return (
        <div dangerouslySetInnerHTML={{__html: description}}></div>
    )
}

export default Description
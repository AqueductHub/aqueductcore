function LinkRenderer(props: React.ComponentProps<"a">) {
    return (
        <a href={props.href} target="_blank" rel="noreferrer">
            {props.children}
        </a>
    );
}
export default LinkRenderer

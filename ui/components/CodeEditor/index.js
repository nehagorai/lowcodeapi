import dynamic from 'next/dynamic';

//This is I figured out, after I added async block it worked otherwise it was not working.
const CodeMirror = dynamic(async () => {
    import('../../../node_modules/codemirror/lib/codemirror.css'),
    import('../../../node_modules/codemirror/theme/nord.css'),
    import('codemirror/mode/shell/shell'),
    import('codemirror/mode/go/go'),
    import('codemirror/mode/php/php'),
    import('codemirror/mode/jsx/jsx'),
    import('codemirror/mode/markdown/markdown'),
    import('codemirror/mode/javascript/javascript');
    import('codemirror/mode/python/python');
    import('codemirror/mode/ruby/ruby');
    import('codemirror/mode/rust/rust');
    
    const codeMirror = await import('react-codemirror2');
    return codeMirror.UnControlled
}, { ssr: false });
const theme = 'nord'; // codemirror theme, change this for other theme after changing the theme css


export default CodeMirror
export { theme };
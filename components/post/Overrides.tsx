import Notice from './Notice'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus as CodeStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const CodeBlock: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>> = ({
    className,
    children,
}) => {
    let lang = 'text' // default monospaced text
    if (className && className.startsWith('lang-')) {
        lang = className.replace('lang-', '')
    }
    return (
        <SyntaxHighlighter language={lang} style={CodeStyle}>
            {children}
        </SyntaxHighlighter>
    )
}

const PreBlock: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>> = ({
    children,
    ...rest
}) => {
    // @ts-ignore
    if ('type' in children && children['type'] === 'code') {
        return CodeBlock(children['props'])
    }
    return (
        <pre {...rest} className="bg-gray-800 p-4 overflow-auto">
            {children}
        </pre>
    )
}

const TableWrapper: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableElement>, HTMLTableElement>> = ({
    children,
    ...props
}) => (
    <div className="overflow-x-auto">
        <table {...props}>{children}</table>
    </div>
)

export const mdOverrides = {
    Notice: {
        component: Notice,
    },
    table: {
        component: TableWrapper,
    },
    pre: {
        component: PreBlock,
    },
}

const TestIcon = (props: any) => {
    return (
        <svg width="1700" height="500" viewBox="0 0 1600 2000" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style type="text/css">{`
                    .cut path {
                        stroke-dasharray: 3000;
                        stroke-dashoffset: 3000;
                        animation: draw 3s linear infinite;
                    }
                    @keyframes draw {
                        to {
                            stroke-dashoffset: 0;
                        }
                    }
                `}</style>
            </defs>
            <g id="page-fold" className="cut" fill='none' stroke='#00ADEE' stroke-width="4.0">
                <path id="page-fold-hor-1" d="M 382.68 1650.57 L 1233.07 1650.57" />
                <path id="page-fold-hor-2" d="M 1233.07 1083.64 L 382.68 1083.64" />
                <path id="page-fold-glue-hor-left" d="M 99.21 800.17 L 1516.54 800.17" />
                <path id="page-fold-glue-vert-left" d="M 1516.54 800.17 L 1516.54 233.24" />
                <path id="page-fold-dust-r" d="M 1516.54 233.24 L 1233.07 233.24" />
                <path id="page-fold-dust-l" d="M 382.68 233.24 L 99.21 233.24" />
                <path id="page-fold-glue-vert-right" d="M 99.21 233.24 L 99.21 800.17" />
                <path id="page-fold-ver-l" d="M 382.68 800.17 L 382.68 233.24" />
                <path id="page-fold-ver-r" d="M 1233.07 233.24 L 1233.07 800.17" />
                <path id="page-fold-tuck-fold" d="M 399.69 1931.2 L 1216.06 1931.2" />
            </g>
            <g id="page-cut" className="cut" fill="none" stroke="#D41A5A" stroke-width="10.0">
                <path id="page-cut-tuck" d="M 382.68 1934.03 L 396.85 1934.03 L 399.69 1931.2" />
                <path id="page-cut-tuck-slit2" d="M 1216.06 1931.2 L 1218.9 1934.03 L 1233.07 1934.03" />
                <path id="page-cut-tuck-tuck" d="M 384.09 1934.03 L 384.09 1946.79 A 28.35 28.35 0 0 0 412.44 1975.13 L 1203.31 1975.13 A 28.35 28.35 0 0 0 1231.65 1946.79 L 1231.65 1934.03" />
                <path id="page-cut-front-left" d="M 1233.07 1934.03 L 1233.07 1650.57 L 1233.07 1083.64 L 1233.07 800.17" />
                <path id="page-cut-left" d="M 1233.07 800.17 L 1234.49 800.17 L 1239.49 828.52 L 1516.54 828.52 L 1516.54 800.17 L 1516.54 798.76 L 1544.88 793.76 L 1544.88 239.66 L 1516.54 234.66 L 1516.54 233.24" />
                <path id="page-cut-north" d="M 1516.54 233.24 L 1508.03 224.74 L 1494.52 70.25 L 1279.27 70.25 L 1240.15 216.24 L 1234.48 221.91 L 1234.48 233.25 L 1233.06 233.25 L 829.13 233.25 L 829.13 233.25 A 5.31 5.31 0 0 0 823.81 238.56 L 823.81 238.56 L 823.81 238.56 A 15.94 15.94 0 0 1 807.87 254.51 L 807.87 254.51 A 15.94 15.94 0 0 1 791.92 238.56 L 791.92 238.56 L 791.92 238.56 A 5.31 5.31 0 0 0 786.61 233.25 L 786.61 233.25 L 382.67 233.25 L 381.25 233.25 L 381.25 221.91 L 375.58 216.24 L 336.47 70.25 L 121.22 70.25 L 107.7 224.74 L 99.2 233.24" />
                <path id="page-cut-right" d="M 99.21 233.24 L 99.21 234.66 L 70.87 239.66 L 70.87 793.76 L 99.21 798.76 L 99.21 800.17 L 99.21 828.52 L 376.26 828.52 L 381.26 800.17 L 382.68 800.17" />
                <path id="page-cut-front-right" d="M 382.68 800.17 L 382.68 1083.64 L 382.68 1650.57 L 382.68 1934.03" />
            </g>
        </svg>
    );
};

export { TestIcon };
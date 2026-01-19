import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const ShutterIcon = ({color}: any) => {
  const { primaryColor } = useGomakeTheme();
  const strokeColor = color || primaryColor(500);
  return  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="shutterstock_2504607299 [Converted]-01 1" clipPath="url(#clip0_1533_16061)">
          <g id="Group 1000004670">
              <path id="Vector"
                    d="M3.2387 6.3493L3.42293 6.53893L3.60197 6.34439L3.76589 6.16627L3.92596 5.99233L3.76124 5.82277L2.09536 4.10803L2.09535 4.10802C1.92365 3.9313 1.83659 3.71805 1.83659 3.5103V0.697266V0.447266H1.58659H1.35156H1.10156V0.697266V3.5103C1.10156 3.92692 1.27267 4.32561 1.5728 4.63458L1.57281 4.6346L3.2387 6.3493Z"
                    fill={color || primaryColor(500) } stroke={color || primaryColor(500) } strokeWidth="0.5"/>
              <path id="Vector_2"
                    d="M4.4018 6.34431L4.58083 6.53901L4.76514 6.3493L6.43103 4.6346L6.43104 4.63458C6.73119 4.32559 6.90224 3.92691 6.90224 3.5103V0.697266V0.447266H6.65224H6.41721H6.16721V0.697266V3.5101C6.16721 3.71796 6.08025 3.93113 5.90851 4.10777L5.90845 4.10784L4.24256 5.82258L4.07791 5.99206L4.23785 6.166L4.4018 6.34431Z"
                    fill={color || primaryColor(500) } stroke={color || primaryColor(500) } strokeWidth="0.5"/>
              <path id="Vector_3"
                    d="M6.65217 11.558H6.90216L6.90217 11.308L6.90224 8.49492V8.49492C6.90224 8.07828 6.73119 7.67958 6.43103 7.37062C6.43103 7.37062 6.43103 7.37062 6.43103 7.37062L4.76514 5.65587L4.58083 5.46616L4.4018 5.66086L4.23785 5.83918L4.07791 6.01311L4.24256 6.18259L5.90845 7.89734L5.90845 7.89735C6.08014 8.07406 6.16721 8.28735 6.16721 8.49511V11.308V11.558H6.41721H6.65217Z"
                    fill={color || primaryColor(500) } stroke={color || primaryColor(500) } strokeWidth="0.5"/>
              <path id="Vector_4"
                    d="M1.83663 11.5578L1.83663 11.3078L1.83659 8.49492C1.83659 8.28702 1.92356 8.07385 2.09529 7.89721L2.09535 7.89715L3.76123 6.1826L3.9259 6.01312L3.76596 5.83918L3.602 5.66086L3.42297 5.46616L3.23866 5.65587L1.57278 7.37062C1.57278 7.37062 1.57278 7.37062 1.57278 7.37062C1.27261 7.67958 1.10156 8.07828 1.10156 8.49492V11.3078V11.5578H1.35156H1.58663H1.83663Z"
                    fill={color || primaryColor(500) } stroke={color || primaryColor(500) } strokeWidth="0.5"/>
          </g>
          <path id="Vector_5"
                d="M4.42077 5.99805L4.41406 6.00413L4.42077 6.01022L4.42938 6.00564L4.42077 5.99805Z"
                fill={color || primaryColor(500) }/>    
          <path id="Vector_6"
                d="M3.57893 6.01022L3.58563 6.00413L3.57893 5.99805L3.57031 6.00262L3.57893 6.01022Z"
                fill={color || primaryColor(500) }/>
      </g>
      <defs>
          <clipPath id="clip0_1533_16061">
              <rect width="6.88416" height="11.9999" fill="white"
                    transform="translate(0.558594)"/>
          </clipPath>
      </defs>
  </svg>
}

export { ShutterIcon}
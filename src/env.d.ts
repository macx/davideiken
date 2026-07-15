/// <reference types="astro/client" />

// WebMCP-compatible attributes for tool discovery on forms.
declare namespace astroHTML.JSX {
  interface FormHTMLAttributes {
    toolname?: string;
    tooldescription?: string;
    toolautosubmit?: boolean;
  }
}

import { css } from "@emotion/css";
import { absolute } from "../styles";
import { ButtonGroup, ButtonGroupProps, useTheme } from "@material-ui/core";

const OptionGroup = (props: ButtonGroupProps) => {
   const theme = useTheme();
   const { title, children, ...groupProps } = props;
   return (
      <div
         className={css({
            display: "inline-block",
            position: "relative",
            marginRight: 8,
            marginBottom: 8,
         })}
      >
         <ButtonGroup size="small" {...groupProps}>
            {children}
         </ButtonGroup>
         <div
            className={css(absolute, {
               top: "100%",
               right: 0,
               fontSize: "0.5rem",
               textAlign: "center",
               color: theme.palette.secondary.main,
               opacity: 0.5,
            })}
         >
            {title}
         </div>
      </div>
   );
};

export default OptionGroup;

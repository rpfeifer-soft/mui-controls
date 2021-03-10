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
            marginTop: 16,
            marginRight: 8,
            marginBottom: 4,
         })}
      >
         <ButtonGroup
            size="small"
            sx={{
               "& .MuiButton-root": {
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
               },
            }}
            {...groupProps}
         >
            {children}
         </ButtonGroup>
         <div
            className={css(absolute, {
               bottom: "100%",
               top: "auto",
               marginBottom: -1,
               right: 0,
               fontSize: "0.5rem",
               textAlign: "center",
               background: `linear-gradient(${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
               color: theme.palette.primary.light,
               textShadow: "0px -1px 2px " + theme.palette.background.default,
               borderTopLeftRadius: 6,
               borderTopRightRadius: 6,
            })}
         >
            {title}
         </div>
      </div>
   );
};

export default OptionGroup;

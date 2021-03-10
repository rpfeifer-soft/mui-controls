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
         <ButtonGroup
            size="small"
            sx={{
               "& .MuiButton-root": {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
               },
            }}
            {...groupProps}
         >
            {children}
         </ButtonGroup>
         <div
            className={css(absolute, {
               top: "100%",
               marginTop: -1,
               right: 0,
               fontSize: "0.5rem",
               textAlign: "center",
               background: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
               color: theme.palette.primary.light,
               textShadow: "0px 1px 2px " + theme.palette.background.default,
               borderBottomLeftRadius: 6,
               borderBottomRightRadius: 6,
            })}
         >
            {title}
         </div>
      </div>
   );
};

export default OptionGroup;

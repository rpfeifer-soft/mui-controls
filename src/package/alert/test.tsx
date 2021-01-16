/** @format */

import * as React from 'react';
import { observer } from 'mobx-react';
import Alert from '.';
import { makeStyles } from '@material-ui/core';

type HtmlDivProps = React.DetailedHTMLProps<
   React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement
>;

const useStyles = makeStyles(() => ({
   alert: {
      marginBottom: 8
   }
}));

export interface AlertTestProps extends HtmlDivProps {
}

const AlertTest = observer(({children, ...props}: React.PropsWithChildren<AlertTestProps>) => {
   const styles = useStyles();
   return (
      <div {...props}>
         <Alert className={styles.alert} severity="success" closeIcon={<div/>}>Test</Alert>
         <Alert className={styles.alert} severity="info" closeIcon={<div/>}>Test</Alert>
         <Alert className={styles.alert} severity="warning" closeIcon={<div/>}>Test</Alert>
         <Alert className={styles.alert} severity="error" closeIcon={<div/>}>Test</Alert>
         <Alert className={styles.alert} variant="filled" severity="success" closeIcon={<div/>}>Test</Alert>
         <Alert className={styles.alert} variant="filled" severity="info" closeIcon={<div/>}>Test</Alert>
         <Alert className={styles.alert} variant="filled" severity="warning" closeIcon={<div/>}>Test</Alert>
         <Alert className={styles.alert} variant="filled" severity="error" closeIcon={<div/>}>Test</Alert>
         <Alert className={styles.alert} variant="outlined" severity="success" closeIcon={<div/>}>Test</Alert>
         <Alert className={styles.alert} variant="outlined" severity="info" closeIcon={<div/>}>Test</Alert>
         <Alert className={styles.alert} variant="outlined" severity="warning" closeIcon={<div/>}>Test</Alert>
         <Alert className={styles.alert} variant="outlined" severity="error" closeIcon={<div/>}>Test</Alert>
      </div>
   );
});

export default AlertTest;
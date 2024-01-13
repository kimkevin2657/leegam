import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: '#111',
    color: 'white',
    width: '100%',
    textAlign: 'center', // Center align text
    padding: theme.spacing(2), // Add some padding
    // position: 'absolute',
    height: '60px',
    // bottom: 0,
    // transform : 'translateY(-100%)',
  },
}));

function Footer() {

  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <div>(주)이감 / 대표자: 김봉소 / 사업자등록번호: 120-87-85755 / 통신판매업신고번호: 제 2018-서울서초-1781 / 개인정보관리자: 이상엽</div>
      <div>서울특별시 서초구 강남대로 16길 3 (양재디에스타워, 구 아산벤처타워) 3층</div>
      <div>Copyright © (주)이감. All Rights Reserved.</div>
    </footer>
  )
}

export default Footer;
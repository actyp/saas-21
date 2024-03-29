import ReactPaginate from 'react-paginate';
import "./Paginate.css";

/*
 * props:
 *  pageCount : int (max number of pages)
 *  setCurrentPageNum : int
 *  scrollToTop : boolean (scroll after page change)
 *  resetSelectedPage : boolean (force reset)
 *  setResetSelectedPage : int (force reset to selected page)
 */
export default function Paginate(props) {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  return(
    <ReactPaginate
      previousLabel={"prev"}
      nextLabel={"next"}
      breakLabel={"..."}
      marginPagesDisplayed={1}
      pageRangeDisplayed={1}
      containerClassName={"pagination"}
      subContainerClassName={"pages pagination"}
      activeClassName={"active"}
      pageCount={props.pageCount}
      forcePage={props.resetPage && (props.resetPage.status ? props.resetPage.pageNum : undefined)}
      onPageChange={(e) => {
        props.setResetPage && props.setResetPage({status: false, pageNum: 0});
        props.setCurrentPageNum(e.selected);
        props.scrollToTop && scrollToTop();
      }}
    />
  );
}
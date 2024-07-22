'use client';
/* eslint-disable @next/next/no-img-element */
import "../../../globals.css";
import ProductCard from "../../components/ProductCard";
import CategoryCard from "../../components/CategoryCard";
import useSWR from "swr";

export default function range(params) {
  const fetcher = (...args)=>fetch(...args).then((res)=>res.json()) 
  const x = Number( params.searchParams.x)
  const y = Number( params.searchParams.y)

  const {data:products,error,isLoading} = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/products/range/`+ x + '/' + y , fetcher)
  const {data:categorys,error:cateError,isLoading:cateLoad} = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/admins/category`, fetcher)

  if (error || cateError) return <div>Lỗi tải dữ liệu</div>
  if (isLoading || cateLoad) return (
    <>
     <div className="loader">
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>
        <div className="bar4"></div>
        <div className="bar5"></div>
        <div className="bar6"></div>
        <div className="bar7"></div>
        <div className="bar8"></div>
        <div className="bar9"></div>
      </div>
    </>
    );

  return (
    <>
     <div class="container-fluid xich p-0 ">    
            <div class="container-fluid to" >
                <section class="container" style={{color: 'black'}}>
                    <h5 class="navBanner">
                    <CategoryCard data={categorys}></CategoryCard>
                    </h5>
                </section>
            </div>
      </div>
          <div>
            <div className="container-lg" style={{ display: 'flex' }}>
              <h2>
                <b>Kết Quả Lọc Theo Giá Tiền Từ {x.toLocaleString()+'đ'} Đến {y.toLocaleString()+'đ'}</b>
              </h2>
              {/* <div className="que"></div> */}
            </div>
            <br />
            <div className="container-lg cate">
              <ProductCard data={products} />
            </div>
          </div>
    </>
    );
  }
import { useEffect, useState } from "react";
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import './commom.css';


function Home()
{
    var idref=sessionStorage.getItem("id");

    const history=useHistory();
    const [message,setMessage]=useState("");

    const [quotes,setQuotes]=useState([]);

    const [searchText, setSearchText]=useState("");

    const [favquote,setFavQuote]=useState({user_id:0,quote_id:0});

    const [eachquote,setEachQuote]=useState({
        id:0,
        text:"",
        author:"",
        user_id:idref
    });

    useEffect(()=>{
         setTimeout(()=>{
             setMessage("")
         },5000);
         mostLikedQuotesFirst();
     },[message]);

    useEffect(()=>{
        mostLikedQuotesFirst();
        //select();

    },[]);

    const mostLikedQuotesFirst=()=>
    {
        var helper=new XMLHttpRequest();
        helper.onreadystatechange=()=>
        {
            if(helper.readyState==4 && helper.status==200)
            {
                var responseReceived=JSON.parse(helper.responseText);
                setQuotes(responseReceived);
            }
            
        }
        helper.open("GET","http://127.0.0.1:9696/FavouriteQuote");
        helper.send();

    }

    const select=()=>
    {
        var helper=new XMLHttpRequest();
        helper.onreadystatechange=()=>
        {
            if(helper.readyState==4 && helper.status==200)
            {
                var responseReceived=JSON.parse(helper.responseText);
                setQuotes(responseReceived);
            }
            
        }
        helper.open("GET","http://127.0.0.1:9696/AllQuotes")
        helper.send();
    }

    const AddQuote=()=>
    {        
        history.push('/addquote');
    }
    const editMyQuote=(quoteid,text,author)=>{

        sessionStorage.setItem("quoteID",quoteid);
        var quoteid=sessionStorage.getItem("quoteID");
         
        var helper=new XMLHttpRequest();
        helper.onreadystatechange=()=>
        {
            if(helper.readyState==4 && helper.status==200)
            {
                var responseReceived=JSON.parse(helper.responseText);
                console.log(responseReceived);
                if(responseReceived.validate==idref)
                {
                    console.log("You Can Edit");const select=()=>
                    {
                        var helper=new XMLHttpRequest();
                        helper.onreadystatechange=()=>
                        {
                            if(helper.readyState==4 && helper.status==200)
                            {
                                var responseReceived=JSON.parse(helper.responseText);
                                setQuotes(responseReceived);
                            }
                            
                        }
                        helper.open("GET","http://127.0.0.1:9696/AllQuotes")
                        helper.send();
                    }
                    sessionStorage.setItem("editauthor",author);
                    sessionStorage.setItem("edittext",text);
                    history.push('/editmyquote/'+quoteid);
                }
                else
                {
                    setMessage("YOU CANNOT EDIT THIS QUOTE");
                }
                
            }
            
        }
        helper.open("GET","http://127.0.0.1:9696/EditQuoteValidate/"+quoteid);
        helper.send();
        
    }
     const favouriteQuote=(quoteid,userid)=>
     {
        console.log(quoteid);
        console.log(userid);
        favquote.user_id=idref;
        favquote.quote_id=quoteid;
        console.log(favquote);
        

        if(userid!=idref)
        {
            var helper=new XMLHttpRequest();
        helper.onreadystatechange=()=>
        {
            if(helper.readyState==4 && helper.status==200)
            {
                   var responeReceived=JSON.parse(helper.responseText);
                   if(responeReceived.affectedRows!=undefined && responeReceived.affectedRows>0)
                   {
                       setMessage("Added to your Liked List");

                   }
            }

        }
        helper.open("POST","http://127.0.0.1:9696/FavouriteQuote");
        helper.setRequestHeader("Content-Type","application/json");
        helper.send(JSON.stringify(favquote));
        }
        else
        {
            setMessage("Cannot Like Your Own Quotes");
        }

     }

     const shiftToFav=()=>
     {
        history.push('/favouritequotes');

     }
     const myAlert=()=>
     {
        window.alert(message);
     }

    const deleteMyQuote=(quoteid,userid)=>
    {
        sessionStorage.setItem("quoteID",quoteid);
        var quoteid=sessionStorage.getItem("quoteID");
        eachquote.id=quoteid;
        eachquote.user_id=userid;
        console.log(eachquote);
         
       if(userid==idref)
       {
        var helper=new XMLHttpRequest();
        helper.onreadystatechange=()=>
        {
            if(helper.readyState==4 && helper.status==200)
            {
                var responseReceived=JSON.parse(helper.responseText);
                console.log(responseReceived);
                select();
            }
            
        }
        helper.open("DELETE","http://127.0.0.1:9696/EditQuoteValidate/"+quoteid);
        helper.send();

       }
       else
       {
        setMessage("YOU CANNOT DELETE THIS QUOTE");

       }

    }

    const onSearch=(args)=>
    {
        setSearchText(args.target.value);
    }


    return(
        <>
        <center>
            <div className="myIntro heading">
                <div>
                <h1 className="heading">Quotes Around The World</h1>
                </div>
                <div>
                    <h3>Welcome! {sessionStorage.getItem("firstName") +" "+ sessionStorage.getItem("lastName")}</h3>
                </div>

            </div>
               

               <button className="heading">All</button>
               <button onClick={shiftToFav} className="heading">Favourite</button>
               <br></br><br></br>
               Search:<input type="text" value={searchText} onChange={onSearch} placeholder="By Quotes" className="heading"></input>
               <br></br><br></br>
               <h1 className="heading" style={{alignContent:"center"}}>{message}</h1>
               <table className="table table-bordered table-hover loginTable">
               
                <tbody>
                    {
                        quotes.map((each)=>{
                            if(searchText!="")
                            {
                                if(each.text.toLowerCase().includes(searchText.toLowerCase()))
                                {
                                    return(
                                        <tr>
                                            <td className="quotes">
                                            <h2 className="quotes">{each.text}</h2> <h3>-{each.author}</h3>
                                            </td>
                                            <td>
                                                <button className="btn btn-warning" onClick={()=>{editMyQuote(each.id,each.text,each.author)}}>EDIT</button>
                                            </td>
                                            <td>
                                                <button className="btn btn-danger" onClick={()=>{deleteMyQuote(each.id,each.user_id)}}>DELETE</button>
                                            </td>
                                            <td>
                                                <button className="btn btn-information" onClick={()=>{favouriteQuote(each.id,each.user_id)}}>Likes</button> 
                                                <label>{each.total}</label>  
                                            </td>
                                        </tr>
                                    );
                                }
                                else
                                {
                                    return;
                                }
                            }
                            else
                            {
                                return(
                                    <tr>
                                        <td className="quotes">
                                        <h2 className="quotes">{each.text}</h2> <h3>-{each.author}</h3>
                                        </td>
                                        <td>
                                            <button className="btn btn-warning" onClick={()=>{editMyQuote(each.id,each.text,each.author)}}>EDIT</button>

                                        </td>
                                        <td>
                                            <button className="btn btn-danger" onClick={()=>{deleteMyQuote(each.id,each.user_id)}}>DELETE</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-information" onClick={()=>{favouriteQuote(each.id,each.user_id)}}>Likes</button> 
                                            <label>{each.total}</label>  
                                            <br></br>
                                            
                                        </td>
                                    </tr>
                                );
                            }
                            
                        })
                    }
                    <tr>
                        <td>
                            <button className="btn btn-success" onClick={AddQuote}>Add Quotes</button>
                        </td>
                    </tr>
                </tbody>
               </table>
               <h1 className="heading">{message}</h1>
               
        </center>
        
        </>
    );

}
export default Home;
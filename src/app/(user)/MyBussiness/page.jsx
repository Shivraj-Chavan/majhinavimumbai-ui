"use client";

import { useState, useEffect } from "react";
import EditBusinessPopup from "@/app/(user)/components/profileComp/EditBusinessPopup";

export default function MyBusinessPage() {
  const [business, setBusiness] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  useEffect(() => {
    const dummyBusiness = {
      name: "CNC WEB WORLD",
      description: "Amazing Faculty and teaching skills",
      hours: "9 AM - 9 PM",
      website: "https://cncwebworld.com",
      contactNumber: "8451060827",
      whatsapp: "9876540432",
      email: "contact@cncwebworld.com",
      location: "Near Stn",
      logoUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPEBAQEQ8QFRARFRUVFRUVEBAVFRUVFRUWFhUWFRUYHSggGBolHRUXITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGi0fICUtLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS03LS03K//AABEIAOEA4QMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYBBAcDAv/EAD0QAAIBAgMFBQUFBwQDAAAAAAABAgMEBREhBhIxQVETImFxgTJCkaHRB1KxweEjM0NTYnKiFBaC8SQ0kv/EABoBAQACAwEAAAAAAAAAAAAAAAAEBQIDBgH/xAAsEQACAgIBBAICAQQCAwAAAAAAAQIDBBESBSExQRNRImFCFDJxgSNDFTNS/9oADAMBAAIRAxEAPwDuIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAAAAAAGADyu7mNGLlL0XNvoaLr41ruZQg5MxaTlKClNJN65dE+GZlTJzjtiSSekextMTIAAAAH+QYADZjzivYNatiFGHtVYL1NUsmuPlnnJHhLG7Zfxo+mbNbzaV7POcT4/3BbfzP8AGX0Mf6+n7PPkR6Qxq2f8aPrmjJZtL9jmjco14TWcZRa8GjfGyMvDMk0fZsPTI/wAAAAAAAAAAAAAAAAAADxvLuNGDnJ+S5tkbIyI1R2zZXW5vSIPDd+6rdrU9iHBcs+SKrEU8m3nLwiZdxqhxXksRfFeAAAfNSais5NJdW8jFyS8gjbvHren7+8+kdfmRLc6qHvZg5pERdbVyf7uml4t5/Ir7erP+KNcrSNrY/czWXaZJ9EkQ59Qul7NbtZHyqyfGUn5tkZ2zflmPJs+DByb8ngPDwyAYyAPqMmuDa8mZKcl4ZltkrYbQ1qTSk9+C5Pjl/cTqOo2Qf5d0bI2NeS34ff068d6D81zXmX9ORC5cos3qSZtG8yB53APQAAAAAAAAAAAAeN5dRowc5ei6sjZGRGmO2Z11ub0io3FxUuqqXNvJLkjmp2Ty7FFFvGEaIbLbZWqowUFy4+L5s6bHojVDiiossc5cme5IMAAAD4r0adTLfgpZdUmap1qXkHhLC7d/wAGn/8AKRpliQflHnGJq1tnLaXuteTyNEun1v0YuuJqVtkqTT3ZzT8cmjRPpkfRi6kRdzsvXim4uMvLNP5kKfT5rwYOl+iHr0J03lOLi/FZEKdU4eTU468nmYHgAAAAABs4deyoVIzjy4rquaJGNe6pbMoS0dBtq8akIzi9JLP9Dq67FOKkiWns9TbsyBieAAAAAAAAAAA87m4jSi5zeSRpvvjVHkzOEHN6RTcTv5V57z9lcF0RymXlSvnv0XNFCrRMbN2OSdWS1ekfLmy26Vi8Y/JLyQcy7b4onS7IJkAAAAAAAAAAypM8aXsHncW1Oqt2cU14r8CPZjxkvAaT8lWxjZpwznRzceLi+K8upT5OC13gaJ1e0VxrIq2tPTNAPDwA9ABgHhcNjrnepSpvjB5ryl+p0PS7eUOP0Sqn2LAWxs0Dw9AAAAAAAAAPmc1FOUnkka7LFCO2exi29Ip+L4i68+kFwX5nKZuY7Z69FzjUKEdvyfGFWTrVFH3VrJ+B5g47ts16Msi344fsukYpJJLJI66MVFaKRvbMmR4AAAAAAAAAAAAADKl1MZRTCKztVhCydeC1Xtpc11KTNxf5I1Ww9oqhTEYyAAAAT2xs8q01ycH8mi16VLVjRtpLhkX+yUZMjwAAAAAAAB6LN8FxMZT4rbCW/BUsbxV1pbsdKcfm+vkcxn5rsfGPgtsbG4rlIi0s9FzKyMXJ6RNctLZccFsexprP25ay/JHW9Pxvhr/ZSZNvyTJAnkcAAAAAAAAAAAAAAAAGKkFOLi+DTT8maLockDnOJW3ZVZ0/uvTy4o5bIr4WNEOcdM1zSYgAAE3sh/7D/sl+KLLpf/tNtPkuh0RKBkeAAAAAABI8322wVzaHFM26MH3V7TXPwOe6lmtvhEssTH/lIgSkZZExs5Y78+0ku7Dh4yLjpeNzlzfhEDNu0uKLSdKVQAAAAAAAAAAAAAAAAABmHExkuwKVtdSyuM/vRT/I5nPjqzZGu8kIQTUAAAT+xsM605dINfFr6Ft0qO5tm6ldy3nQbRI2ZAAAAAAAIrH8S7KPZxfflxfRFT1HM+NcV5JeLRze2VNnMuTZcJJdj6pU3JqKWbbyRnXW5yUUYylxjyZd7G2VKnGC5LXxfM7HGp+KpRKKybnJtmwSDWAAAAAAAAAAAAAAAAAAZjxPH4BTtspZ1orpH8zm+ov8kR7vJAFcaQAAC3bG0MqU5/elkvJHQdKr1ByJNK7FhLbRnoAyAAAABr4jdqhTc3x5LqyJl5Cqhtm2qtzlopNeq5ycpPNs5G2yVkuTLyutQjo8zWZlg2ZsuNaS8I/my+6Rjf8AYyszbdvgiwl+VxkMeyE2j2kpWO7Fxc6kk2oppZLq2ScfGld4IOXnQo8+Ss2W2lzcXNGnGEIwnNJrJttN66+RPt6fGqtybK6rqlltqivB0Epy/ABAbR7U0bPuL9pW+6npH+7p5ErHxJXP6RAy8+FC0u7KXU24vXLNSppfd3FkWq6bVruylfVrm9ly2U2ljexcZJRrRWbSekl1iVmViOmX6LnCzo3rT8lhIZYAAAAAAGYGMn2BQtpau9c1OiyXwSOXzZbtZFtf5EYQzWAAlnpzZ7FcnoJHQ8Ktuyo04c0s35vVnW4tfx1qJMitI2zds9MmR6AAAYclFOTei1MLJqCcmepNvRTcXxB155+6tIr8zk8zK+Wf6LrGo4R7miQSTs9Lai6k4wjxk8jbRW7ZqCNdk+EWy829FQjGC4RSR2lVargoooZycntnobDEzExkDj+113215WknnFPdXklkdNgVcKF+zj+o287n+je+z2z7S733wpRcvV6L8TX1OzjWl9m7pNXK7l9HUTnzqiu7X7Rxs4dnBp15rRfdT95kvExXdLb8Irs7N+FcY+WVnAdj6t2v9RcVJRU9VznLPm8+BOvz40LhWvBW4/Tp3/nY/JBbRYV/o68qW9vJJNPnk+viTsPI+evkyuzcdUWcEeuyNdwvbdr3pbr8mmY50E6mzZ0+bjekjsBzXbwdgAAAAAAfNapuQnN+6m/gjTdLUWG9I5rXqucpTfGTb+JyVknKTkQZPbPgwAAJPZ2y7WvH7sO8/TgviTsCl2WfpGyqO2Xw6glAAAAAIAgtpcQy/Yxf930KHqmV/CJPw6dvkytlAWoALBsxZcazXhH82X/Scf8A7GVmbbv8EWEviuABr4lcKlQq1G8t2Mn8tBGLnNRRqumoVtnEJSb1fF6vzZ10FpI4icuUmzon2aWe7Rq1v5kt1eUf+yk6nZufH6Oi6PVqDn9lkxvFIWlGVWWWfCK+9LkiBTU7ZqMSyyb40wcmU3ZbBZXtaV7c6wcs0n7z5f8AFFllXKmHxV/7KjDxpX2fNZ4OhQXwRTy8F+lo4/tjddre1mnomoryijpenVuNCTOP6jYp3to+9irftL6j0g3J+iZ7nySpZ702HK9HWzmzrzIAAIy+xeNO5oW0VvTqN72vsRyepthU5Qc/RHnkKNigSZqJBEbV3fZ0N1caj3fTmVfUbeMNGFj1EoxzpDMg9A1sF52bsexoptd+feflyR1GBR8dff2Sq46RLE42AAAAA18Qu1Qpub48l1ZEy8hVQNtNbnLRSK1Vzk5Pi3mchbY5y5F7CKhHR8mBkj6o03OUYrjJ5Izrg7JqKMJy4xbL1bUFThGC4RWX1O0or+OtRRQzk5SbZ6m4wABWPtFvFTtOzz71SSXonmyX06tzv39FZ1W3hTr7OXcTpn2RyqW3o7Js5Zq2tKUZNLdjvSfn3mcrk2fJa2jssSHw0pMp15KeL3u5BtW9Li+W6nrLzfIn1pYtO3/cyqs5Zt+l/ajoFvRjThGEFlGCSSXJIqpScntl7XBQioo+MRu40KNSrLhGLf0PIwc5qCMbrFCtyZxGpJybk+Leb9TroLjFI4eyXKTZc/sytc6laq/diorzlq/wKrqlniJd9Gq/JzOhFMdEZAPC+u4UKcqtR5Rij2MHOSijXbYq4uTKrsZQncVauIVVrN7tPwS0eXhy+JPymq4qmJWYEJWzd8vfguUUV0mW5R9qb3tazin3aenrzOZz7udnEjWy29EMQDUZPTwk9n8Pdeqs13Iay/JE7BxnZZt+EbK47Zezp12RLMgAAAGYo8fgFT2kvO0qbifdh+PM5fqWRznxRb4dXGO37IkqyaACY2Ztt6o5vhBfNlt0inlPm/RAzZ6jx+y0nTlUABFannoHOftNu96vSpL3IuT85foi56TXqLmc51qxOaiVzAbPt7mjS5Sks/Jav8Cxy7OFTZW4dfyXRRf9u8UcIQtKOtWvlFpcVF6fPgUWHUpSdsvCOg6hc4xVMPLJTZnB1Z0I0/fes3pxfLPojXk3fLPfr0SsPHVNaXv2SpHJZV/tHu1C1VPPvVJL4R1f5EzptfK/f0VXVreNOvs5edKzlfZ1fYWydKzg2spVG5vyfs/I5rOs52s67plPx0p/ZYiGWISPG+wZQdqr6d/dQsaPsQl3nno2uOfgvxLTFrVNfyz/ANFFl2vIuVMPHsu9nbRo04U4LKMEkvTmV05OTbZc1wVcVFHjjN8rejKXvPSPmQMy744Myk9LZz2Tbzb4s5iTbe2Q33ewYg+qcHJqKWbbyXqZRg5tRQS2dAwmxVClGHPjJ9WdXi0KqtImRWkbpJMgAAAAauK3fY0nL3novNkHOv8Ajg9G6ivnNIpDebz6nJSk5PbL1JJaBieg9QLfgNsoUYvnPvP8jrOm08Kf8lJlT5TZJFgRgAZj1MZeAca2nue1vLieea32l5R0/I6jBhwpicZn2c72yR2HcKVStc1PZoU2/wDlLRGjqG5JVr2SOm8YN2y9E3sjbTvLipiFZcHlTXJNdPJfiyFlSVUFVH/ZY4UJX2O+X+i8FaXRmKPGDmf2kXu/dRp8qUfnPJl30qvVbl9nM9Zt5WKP0VmytXWqQpx4zkkvUsrpqEG2VdEHOaidtt6ShCMFwilH4LI5ST22zt648YpHoeGZA7Y45/o6GUX+2qZqPh1l6EnFo+Wzv4RAz8n4a9LyzW2JwPsKXbVF+3qrN5+7F6pevE2Zd/N8F4Rr6fi/HHnLyy0RRBb0izKTtTiHa1dxPuU9PN8zm8+/nPRGtlt6IUrkajABa9lMLyXbzWr9heHNl707F0vkkSKoa7llLk3AAAAARR4/AKvtPdb9RQXCH4s5nql/KfFFrhV6jyIYqSeAD7t6e9OMVzaRtohysSNdsuMGy+QgopJcEsjtYR4xSRQN7e/s+jM8ABo47edhbVqmfCLy83ojKqHO1RNGVZ8dTkcVbb15s62K1HRxMpbeyUwtTrKNpT41qicn4JaZ+C4kbI1B/I/RLxlKf/HH2dbw+zhQpQpQWUYLL6s5yybnJyZ1tNSrioo2TA2mU8k2+CMZfR43pbOKY3c9tc16mftTll5J5L5HV4sOFKRxWXZztlImvs9s+0u+05UYuXq9EROp2ar19k3pFXK3f0dPKFnUnjfXcLenOrUeUYLP6IyjBzkoo1W2quDlIoeB29TFLuV1Vz7Gm9IvhxzjD6lpdJY1Srj5ZSY9c8u75J/2o6EVP7L/AER20GIKhReT7881H6kDNyPjgeTlpFCbz1OZbcnshvuYPAS2z+FuvPOSfZx1b6vkiwwcR2y5Pwba4bLyl0OlS0tEkyegAAAAGKlRQhKT5Jv4Gi+fGLZlFbaRQq1TflKT5ts466fOTZf1x4xSPg1GYAJDAIZ3EPDN/IsOmR5XoiZj1WXE60pgAACp/aVdbttCmnrOa+Czb+eRO6ZDldy+ip6vZxq4/ZzM6M5Yv32b4Vkp3Mlq+7Dy95r8Cj6lfuXBHRdHxtL5GXkqvZemQDRx65VG1rTfKEsvNrJGVUedqRHyp8KpM4rmddFfjo4qT33Oi/Zna7tGrV5znuryivqyh6nZuxI6Po9eq3L7Lk2km28kuLK0uW+3c57tDic8TuIWlBPsoy1fXJ5OT/pRbUUrHh8k/LKHKueVZ8UPCLxhlhC2pRpQXdiuPNvm34lbZY7JcpFzTSqoKMTbzSzb4I0Tkoo3HP8AG8QdxVcvdWkV4Lmcvl3uybItktvRoEQ1mzh1jKvUUIrjxfRc2SMfHldLijKEW2X+ztY0YRpx4RXx8WdTTUq4qKJaWux7m09AAAAAAI7aOru0Gucsl9Sr6lbxraJWLHdiKcjli6MgAAl9mI51m+kX+RbdIj/zbIOc/wAC1HTlSADMeJ4Dmn2lXe/cwpr+HDXzk8y76TXqDf2c11mzdij9FWtqLqThBcZyUV6vIs7Z8I7ZU1V85KKO1YfZxoUoUo8ILL6nK2Tc5OR21Nargoo2TA2gAgtuoOVjVy5br9E9TdhPWQtkHqK3js5IdUjjjo+weLUI2vZSqRhODbe80s09c11KHPpn8u0jp+m5NcauLejQ2q2pdz/4tpvNSe7KS4y8I+HibMbDVf8AyWmjMz3a/iqLDsns+rOnnLJ1prvPp/SiHlZLtl28In4OGqI7flk+RSwK/tXiihHsYPvS9rLkunqU/UcpJcUarJaWinlF32Rj1t6EqklCKzcnkZ11SslxXsJNvRfMIw2NvT3VrN+0+r6eR1GLjKmOvZMjHSN8lGQAAAAAAAK7tbV1hHwbOc6rPeollgx8sgClLIAAAltmZZVsusWW3SZauIOcvwLUdOVJkAzExm+wOQ45bXFxd12qNWUnOSSUJPRPJcjo8W2uulbkcll1W2XvUSf2K2ZrQrKvXg4KGe7GS1bfPLlkRc7NjOPGDJ3TcCUJ87EX4qC/AAAPi5oRq05U5LOMk4vyaMG3FqS9GM4KcXFnH8ewKraVJRcJOnn3Z5aNctep02LmQtiu/c5HLwp1Sfbsallh1au1GlSnJ+EXkvN8Eb7MiuC/JmirGssekjo+ymysbT9rUalXa000h1S6sosvMdvZeDpMHAVK5S8lmIRZ/s8b+7jQpyqS9F1fJEfJuVcWzxvS2c7ua8qk5Tk+9J5s5WyznJyZDk+T2fFODk1GKzk9EkYwg5tKIS2XjAcJVvHOX72XF9F0R0uFifDHb8kqEOKJYnmYAAAAAAAABVdqJZ1l4RRyfU3uZb4S/AiCuRNAAANnDbjsqsJ8k9fJkrDt+O5M0ZEOVbLudknvuURk9BlM8a2Bn4IJdjww2e6PQAAAAMwBLJ6NJmKjp7XY8aT8mIRUdIxSXgkjLz5Z4opeEAZGdOL4IxlLitgo20WKdvUyj+7hovF9Tmc3Jds+K8EWye3oioRbaSTbeiSIcYuUtI1629F2wHBVQipzSdV/4+XidHhYSqXJ+SVXDRMFibAAAAAAAAAAAVbaiOVZPrFHK9TX5ot8H+xkOViJoAAAPUCz7P4ipxVKXtRWnijpem5imuEvJUZVHGXJeCaLchAAAAAAAAAAAAAAZAEDtVinZw7GD78uPhEqOoZXFcUarJ6RToQbeSTbfBJFFGLk9LyRl3LpgGBqilUqa1XwXKP6nQ4WEq1yl5JMK9E2WZtAAAAAAAAAAAAILau30hUXLR+pz/VKu2ywwp6lorZRFoAAAADNOTi008muDM4TlF7RjKKktMsOG4+nlGrx+99UX2J1RNcbCsuw2u8Scp1IyScWmnzRcwsjJdmQXFryfZmeAAAAAAAAAA8BrYleq3pSqPjyXV8kRsm9VQ2zyT0tnPqk51qjbzc5v5s5iTldMhtuT2XDAcEVDvz1qtekf1L/AAsFVLlLySYV6JosjYAAAAAAAAAAAAADwxG37WlKPNrTzXAhZlXOOjbVPhLZRpRabT4p5fA5KcOEmi9jJSWzBgZAAAAAAH3Srzg84ya8mzdC+yD/ABejXKqEvKJGlj9dcXF+aJ0Oq2x/ZGlhQfg3Ke0v3qXwl9SXHrK13Rplgv0z1jtJT5wl8UbV1mv6Nf8AQzPpbRU37k/kZx6rGT7I8eHJeWSNpcup/CnFdZZE6m52etEecFH2bJINYAC6vgjGUkltgpOM3s7ysoU03FNqK6vmznMmyeRZxiR5tyekWDBcFjbrel3qr58l5FriYUalt+TZCCiiWLA2AAAAAAAAAAAAAAAGYsxktoELjeC77dSnlvc1yf6lJm4PN8ok7HyeHZlYnBxeTTTXUorISg9SLSM1JbRgwMgAAAAABFN6JNvwM41yfhGLnFeWb1thFepwhkv6tCVXg3T9GieVCPvZKW2zX8yfpH6ssauk/wD2RJ5z/iS1rYUqXswWfV6stacOuvwiJO6c/LNlskpa8GoHoCQBC49czqNWtFZzl7b5RXi+RWZc52P44GE/pGzg+Ewto6a1Gu9J/gvA34uJGpb9iEdEiTDMAAAAAAAAAAAAAAAAAAymYtJ+QeFxZ0qvtxT9NfiRrcSE/KNkLZR8EZW2apt92cl80V9nSovwSo5s15PD/a7/AJv+Jo/8T+zZ/Xfof7Xf83/E9XSf2P6/9HrT2ZgvaqN+SSNkOjx33MJZ0vRt0cFt4e7m/F5kyHTaomiWVY/Zu0qMIezCK8kiXDHhH+1Glzk/J6OTNqWvBiYPQAAAADKWj6mMttdga9pbRpJ5aylrKT4yfiYQqUf8niR7m09AAAAAAAAAAAAAAAAAAPbdXQAbq6ADdXQAJAGQDGQA3V0AG6ugA3V0AG6ugA3V0AG6ugA3V0AG6ugA3V0AG6ugA3V0AG6ugA3V0AG6ugA3V0AG6ugA3V0AG6ugA3V0AG6ugA3V0AG6ugA3V0AMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k=",
      photos: [
        "https://via.placeholder.com/300x200.png?text=Photo+1",
        "https://via.placeholder.com/300x200.png?text=Photo+2",
        "https://via.placeholder.com/300x200.png?text=Photo+3",
      ],
      area: "Opp parijat",
      pincode: "876543",
    };
  
    setBusiness(dummyBusiness);
  }, []);
  

//   useEffect(() => {
//     const fetchMyBusiness = async () => {
//       try {
//         const res = await apiGet("/MyBussiness");
            // console.log("Response received:", res);
//         setBusiness(res.data);
//       } catch (err) {
//         console.error("Failed to load business:", err);
//       }
//     };
//     fetchMyBusiness();
//   }, []);

  const handleUpdate = (updatedData) => {
    console.log("Updated :", updatedData); 
    setBusiness(updatedData);
    setShowEditPopup(false);
  };

  if (!business) return <p className="text-center text-gray-600 mt-10">Loading your business profile...</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        My Bussiness Profile
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-10">

        {/* Logo and Description */}
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-35 h-35 bg-gray-100 border rounded-full flex items-center justify-center overflow-hidden">
            <img src={business.logoUrl || "/logo-placeholder.png"} alt="Business Logo" className="object-contain w-full h-full"/>
          </div>
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">{business.name}</h2>
            <p className="text-gray-600">{business.description}</p>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Photos */}
        {business.photos?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Photo Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {business.photos.map((url, index) => (
                <img key={index} src={url} alt={`Photo ${index + 1}`} className="w-full h-30 sm:h-40 object-cover rounded-lg border"/>
              ))}
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <InfoCard label="Area" value={business.area} />
          <InfoCard label="Pin Code" value={business.pincode} />
          <InfoCard label="WhatsApp Number" value={business.whatsapp} />
          <InfoCard label="Email" value={business.email} />
          <InfoCard label="Website" value={ business.website ? (
                <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" >
                  {business.website}
                </a>
              ) : (
                "-"
              )
            }
          />
          <InfoCard label="Location" value={business.location} />
          <InfoCard label="Business Hours" value={business.hours} />
        </div>

        {/* Edit Button */}
        <div className="flex justify-end">
          <button onClick={() => setShowEditPopup(true)} className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg shadow transition" >
            Edit Business Info
          </button>
        </div>
      </div>

      {/* Sticky Edit Button on Small Screens */}
      <div className="fixed bottom-4 right-4 md:hidden z-50">
        <button onClick={() => setShowEditPopup(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg">
          Edit
        </button>
      </div>

      {/* Edit Popup */}
      {showEditPopup && (
        <EditBusinessPopup business={business} onClose={() => setShowEditPopup(false)} onSave={handleUpdate}/>
      )}
    </div>
  );
}

// InfoCard Component
const InfoCard = ({ label, value }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
    <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
    <p className="text-gray-800">{value || "-"}</p>
  </div>
);

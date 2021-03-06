import LinkedList from '../linkedList';
import { wrapper } from '..';
import {fromFetch} from 'rxjs/fetch'
import { switchMap, catchError } from 'rxjs';


const apiKey = "AIzaSyCdpAYWWO1v16PLlO2oKOLwV3D90pFJd-U"
let nextPageToken = null
let amount = 9
export const list = new LinkedList()

export async function searchYoutube(e) {
    e.preventDefault()
    let request = e.target.value
        const data$ = fromFetch(`https://www.googleapis.com/youtube/v3/search?q=${request}&title=snippet&order=rating&quotaUser=100&maxResults=${amount}&type=video&key=${apiKey}`).pipe(
            switchMap(response => {
                if(response.ok){
                    return  response.json()
                }
        //         let results = response.json()
        //         results.items.map(item => {
        //     list.add(item.id.videoId)
        // })
        // nextPageToken = results.nextPageToken
        // makeVideoCards()
            }),
        // let results = await response.json()
        catchError(err => {
         console.error(err)
     })
)
data$.subscribe({
    next: result => result.items.map(item => {
        list.add(item.id.videoId)
        nextPageToken = result.nextPageToken
        makeVideoCards()
    })
})
}

function makeBtnToLoadMore() {
    let btnLoadMore = document.createElement('button')
    let arrowDown = document.createElement('object')
    arrowDown.data = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'%3E%3C!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --%3E%3Cpath d='M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z'/%3E%3C/svg%3E"
    arrowDown.className = 'arrow-down'
    btnLoadMore.innerHTML = 'LOAD MORE'
    btnLoadMore.appendChild(arrowDown)
    btnLoadMore.className = "btn-load-more"
    wrapper.appendChild(btnLoadMore)
    btnLoadMore.addEventListener('click', makePagination)
}

async function makePagination() {
    let request = document.getElementById('request').value

        let data$ = fromFetch(`https://www.googleapis.com/youtube/v3/search?q=${request}&title=snippet&order=rating&quotaUser=100&maxResults=${amount}&type=video&key=${apiKey}&pageToken=${nextPageToken}`).pipe(
            switchMap(response => {
                if(response.ok){
                    return  response.json()
                }
            }),
       
        catchError(err => {
         console.error(err)
     })
        )
        data$.subscribe({
            next: result => result.items.map(item => {
                list.add(item.id.videoId)
                nextPageToken = result.nextPageToken
                makeVideoCards()
            })
        })
}
export function makeVideoCards() {
    let i = 1;
   
    if (wrapper) {
        let size = Array.from(document.querySelectorAll('.video-wrapper')).length 
        i = size
    }
    if (document.querySelector('.btn-load-more') === null) {
        makeBtnToLoadMore()
    }
    for (i; i <= list.size() - 1; i++) {
        let template = document.getElementById('template-video')
        var clone = template.content.cloneNode(true);
        wrapper.appendChild(clone)
        let videoIframe = document.querySelectorAll('.video')[i]
        let heart = document.querySelectorAll('.heart')[i]
        
        
        if (list.elementAt(i)) {
            let videoId = list.elementAt(i)
            heart.id = list.elementAt(i)
            videoIframe.src = `http://www.youtube.com/embed/${videoId}?autoplay=1?enablejsapi=1&origin=http://localhost:4200`
        }
    }
}




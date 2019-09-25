function drawD3Chart() {
   console.log('working on it, take it easy..');

   let svg = d3.select('svg');

   let diameter = +svg.attr('width');

   let g = svg.append('g')
               .attr('transform', 'translate('+ diameter/2 + ',' + diameter/2  + ')');

   var color = d3.scaleLinear()
   .domain([-1, 5])
   .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
   .interpolate(d3.interpolateHcl);

   let pack = d3.pack()
               .size([diameter, diameter])
               .padding(2);

               
   d3.json('my.json').then(root => {
       
        svg.style("cursor", "pointer")
            .on("click", () => zoom(root))
            .call(responsivefy);

        root = d3.hierarchy(root)
                .sum(d => d.value)
                .sort((a,b) => b.value - a.value);

        let focus = root,
            nodes = pack(root).descendants(),
            view;

        let circle = g.selectAll('circle')
                    .data(nodes)
                    .enter().append('circle')
                    .attr('class', () => 'node')
                    .style('fill', d => color(d.depth))
                    .on('click', d => focus !== d && (zoom(d), d3.event.stopPropagation()));

        let text = g.selectAll('text')
                    .data(nodes)
                    .enter().append('text')
                    .attr('class', 'label')
                    .style('fill-opacity', d => d.parent === root ? 1 : 0)
                    .style('display', d => d.parent === root ? 'inline' : 'none')
                    .text(d => d.data.genre);

        let node = g.selectAll('circle, text');

        svg
        .style("background", color(-1))
        .on("click", function() { zoom(root); });

        zoomTo([root.x, root.y, root.r * 2]);

       function zoom(d) {
            focus = d;

            //create new playlist or seed of artistes or genre, send
            let newarray = [];
            //console.log(focus.data.artists)/////
            if( focus.data.artists !== undefined) {

                focus.data.artists.slice(0, 5).forEach(element => {
                    newarray.push(element.id);
                });

                getRecommendationsBasedOn(newarray.join());
            }
            
            let transition = d3.transition()
                                .duration(d3.event.altKey ? 7500 : 750)
                                .tween('zoom', d => {
                                    let i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                                    return t => zoomTo(i(t));
                                })

            transition.selectAll('text')
                        .filter(d => { d.parent === focus})
                        .style('fill-opacity', d => d.parent === focus ? 1 : 0)
                        .on('start', d => { if (d.parent === focus) this.style.display = "inline"; })
                        .on('end', d => { if (d.parent !== focus) this.style.display = "none"; });
        }

        function zoomTo(v) {
            let k = diameter / v[2]; view = v;
            node.attr('transform', d => 'translate(' + (d.x - v[0]) * k + ',' + (d.y - v[1]) * k + ')');
            circle.attr('r', d => d.r * k);
        }

        // iframe.contentWindow.location.reload(forceGet)();

        //document.getElementById('widget').contentWindow.location.reload(true);
   })

   //document.getElementById('widget').contentWindow.location.reload(true);
}

function getRecommendationsBasedOn(seedArtists) {
    //let newarray = [];

    fetch(`https://api.spotify.com/v1/recommendations?limit=50&seed_artists=${seedArtists}`, {
        method : 'GET',
        headers : {
            Authorization: `${tokenType} ${accessToken}`
        }
    })
    .then(res => res.json())
    .then(function (data, ...newarray) {
        

        data.tracks.forEach(element => {
            newarray.push(element.uri);
        });

        //console.log(newarray.join());

        add(newarray.join(), '6Nao3rMGoXHaFd0QAcTKPc')
    })
    .catch(e => console.log(e))

    //console.log(newarray.join());

    //add(newarray.join(), '6Nao3rMGoXHaFd0QAcTKPc')
}

function add(tracks, toPlaylist_id) {
    //console.log(tracks);

    fetch(`https://api.spotify.com/v1/playlists/${toPlaylist_id}/tracks?uris=${tracks}`, {
        method : 'PUT',
        headers : {
            Authorization: `${tokenType} ${accessToken}`
        }
    })
    //.then(document.getElementById("widget").src = "https://open.spotify.com/embed/playlist/6Nao3rMGoXHaFd0QAcTKPc")
    .catch(e => console.log(e))
    console.log('done');
    
    reload();
}
function reload() {

    console.log('reload');
    //document.getElementById('widget').src = document.getElementById('widget').src
    //window.frames['widgetId'].location.reload();
    document.getElementById('widgetId').src += '';

    // var iframe = document.getElementById('widgetId');
    // iframe.src = iframe.src;

    //document.getElementById('widgetId').contentDocument.location.reload(true);

    //iframe.contentWindow.location.reload();

}

/* resposivefy by Brendan Sudol https://brendansudol.com/writing/responsive-d3 */
function responsivefy(svg) {
   // get container + svg aspect ratio
   var container = d3.select(svg.node().parentNode),
       width = parseInt(svg.style('width')),
       height = parseInt(svg.style('height')),
       aspect = width / height;

   // add viewBox and preserveAspectRatio properties,
   // and call resize so that svg resizes on inital page load
   svg.attr('viewBox', '0 0 ' + width + ' ' + height)
       .attr('perserveAspectRatio', 'xMinYMid')
       .call(resize);

   // to register multiple listeners for same event type, 
   // you need to add namespace, i.e., 'click.foo'
   // necessary if you call invoke this function for multiple svgs
   // api docs: https://github.com/mbostock/d3/wiki/Selections#on
   d3.select(window).on('resize.' + container.attr('id'), resize);

   // get width of container and resize svg to fit it
   function resize() {
       var targetWidth = parseInt(container.style('width'));
       targetWidth = targetWidth*.45 //?
       svg.attr('width', targetWidth);
       svg.attr('height', Math.round(targetWidth / aspect));

       document.getElementById('widgetId').height = targetWidth;
   }
}
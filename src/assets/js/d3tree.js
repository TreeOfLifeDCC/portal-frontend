var url = "https://portal.darwintreeoflife.org/api/taxonomy/tree";
treeJSON = d3.json(url, function(error, treeData) {

    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    // variables for drag/drop
    var selectedNode = null;
    var draggingNode = null;
    // panning variables
    var panSpeed = 200;
    var panBoundary = 20; // Within 20px from edges will pan when dragging.
    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;
    var clickCount = 0;

    // size of the diagram
    var viewerWidth = $(document).width();
    var viewerHeight = $(document).height();

    var codes = {
        m: 'mammals',
        d: 'dicots',
        i: 'insects',
        u: 'algae',
        p: 'protists',
        x: 'molluscs',
        t: 'other-animal-phyla',
        q: 'arthropods',
        k: 'chordates',
        f: 'fish',
        a: 'amphibians',
        b: 'birds',
        e: 'echinoderms',
        w: 'annelids',
        j: 'jellyfish',
        h: 'platyhelminths',
        n: 'nematodes',
        v: 'vascular-plants',
        l: 'monocots',
        c: 'non-vascular-plants',
        g: 'fungi',
        o: 'sponges',
        r: 'reptiles',
        s: 'sharks',
        y: 'bacteria',
        z: 'archea'
    };

    var tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);

    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });

    // Define the div for the tooltip
    var div = d3.select("#tree-container").append("div")
        .attr("class", "col-md-12 tooltip")
        .style("opacity", 0)
        // .style("padding-top", "10px")
        .style("font-weight", "lighter")
        .style("background", "none")
        .style("font-size", "initial");
    // .style("text-align", "initial");

    // A recursive helper function for performing some setup by walking through all nodes

    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    // Call visit function to establish maxLabelLength
    visit(treeData, function(d) {
        totalNodes++;
        maxLabelLength = d.name.length + d.commonName.length + 5;
    }, function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });

    // sort the tree according to the node names
    function sortTree() {
        tree.sort(function(a, b) {
            return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
        });
    }
    // Sort the tree initially incase the JSON isn't in a sorted order.
    sortTree();

    // TODO: Pan function, can be better implemented.

    function pan(domNode, direction) {
        var speed = panSpeed;
        if (panTimer) {
            clearTimeout(panTimer);
            translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            scaleX = translateCoords.scale[0];
            scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function() {
                pan(domNode, speed, direction);
            }, 50);
        }
    }

    // Define the zoom function for the zoomable tree
    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select("#tree-container").append("svg")
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("class", "overlay")
        .call(zoomListener)
        .on("dblclick.zoom", null);

    // Helper functions for collapsing and expanding nodes.

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function expand(d) {
        if (d._children && d._children.length === 1) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    var overCircle = function(d) {
        selectedNode = d;
        updateTempConnector();
    };
    var outCircle = function(d) {
        selectedNode = null;
        updateTempConnector();
    };

    // Function to update the temporary connector indicating dragging affiliation
    var updateTempConnector = function() {
        var data = [];
        if (draggingNode !== null && selectedNode !== null) {
            // have to flip the source coordinates since we did this for the existing connectors on the original tree
            data = [{
                source: {
                    x: selectedNode.y0,
                    y: selectedNode.x0
                },
                target: {
                    x: draggingNode.y0,
                    y: draggingNode.x0
                }
            }];
        }
        var link = svgGroup.selectAll(".templink").data(data);

        link.enter().append("path")
            .attr("class", "templink")
            .attr("d", d3.svg.diagonal())
            .attr('pointer-events', 'none');

        link.attr("d", d3.svg.diagonal());

        link.exit().remove();
    };

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

    function centerNode(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }


    function centerNodeOnClick(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    // Toggle children function

    function toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
    }

    // Toggle children on click.

    function click(d) {
        clickCount++;
        if ((d._children && d._children.length === 1)) {
            singleClickTimer = setTimeout(function () {
                clickCount = 0;
                expand(d);
                singleClick(d);
            }, 400);

        }else if(d.children && d.children.length === 1){
            singleClickTimer = setTimeout(function () {
                clickCount = 0;
                collapse(d);
                singleClick(d);
            }, 400);
        }
        if (clickCount === 1) {
            singleClickTimer = setTimeout(function () {
                clickCount = 0;
                singleClick(d);
            }, 400);
        } else if (clickCount === 2) {
            clearTimeout(singleClickTimer);
            clickCount = 0;
            doubleClick(d);
        }
    }

    function singleClick(d) {
        // if (d3.event.defaultPrevented) return; // click suppressed
        d = toggleChildren(d);
        update(d);
        centerNodeOnClick(d);
    }

    function doubleClick(d) {
        var obj = d
        var jsonArray = []
        while (obj.parent != null) {
            var json = { 'rank': obj.rank, 'taxonomy': obj.name }
            jsonArray.push(json)
            obj = obj.parent
        }
        tempObj = { 'rank': 'superkingdom', 'taxonomy': 'Eukaryota' }
        jsonArray.push(tempObj)
        jsonArray.reverse();
        var encodedJsonArray = encodeURIComponent(JSON.stringify(jsonArray))
        if (d.name != 'Eukaryota') {
            $.ajax({
                url: 'https://portal.darwintreeoflife.org/api/root_organisms/root/filter/results?from=0&size=2000&taxonomyFilter=' + encodedJsonArray,
                type: 'post',
                data: {},
                success: function(response) {
                    $('#organismsTable').DataTable().clear().destroy();
                    $('.modal-heading').text(d.rank)
                    $("#organismsTable").find("tr:gt(0)").remove();
                    var total = response.hits.total.value;
                    var data = response.hits.hits;
                    for (var i = 0; i < total; i++) {
                        var record = data[i]._source;
                        var organism = record.organism;
                        var name = record.commonName != null ? record.commonName : "-";
                        var trackingStatus = record.currentStatus;
                        var tax_id = record.tax_id;
                        var tolid = '';
                        var genome = '';
                        var genomeURL = '';
                        var externalReference = '';
                        var goatLink = 'https://goat.genomehubs.org/records?record_id=' + tax_id + '&result=taxon&taxonomy=ncbi#' + organism
                        var goatElement = '<a class="no-underline badge badge-pill goat-color" target="_blank" style="background-color: #4bbefd; color: #fff;" href="' + goatLink + '">GoaT info</a>'
                        var organismElement = '<a class="no-underline" target="_blank" href="https://portal.darwintreeoflife.org/data/root/details/' + organism + '">' + organism + '</a>'

                        if (record.tolid != null) {
                            const organismName = organism.split(' ').join('_');
                            const clade = codes[record.tolid.charAt(0)];

                            if (record.genome_notes != null) {
                                const genomeLink = record.genome_notes[0].url;
                                const link = `https://tolqc.cog.sanger.ac.uk/darwin/${clade}/${organismName}`;
                                tolid = '<a class="no-underline badge badge-pill" target="_blank" style="margin-left: 3px;background-color: #5cc45e; color: #fff;" href="' + link + '">ToL QC</a>'
                                genomeURL = '<a class="no-underline badge badge-pill" target="_blank" style="margin-left: 3px;background-color: grey; color: #fff;" href="' + genomeLink + '">Genome Notes</a>'
                                externalReference = '<span>' + goatElement + tolid + genomeURL + '</span>'
                            } else {
                                const link = `https://tolqc.cog.sanger.ac.uk/darwin/${clade}/${organismName}`;
                                tolid = '<a class="no-underline badge badge-pill" target="_blank" style="margin-left: 3px;background-color: #5cc45e; color: #fff;" href="' + link + '">ToL QC</a>'
                                externalReference = '<span>' + goatElement + tolid + '</span>'
                            }
                        } else {
                            externalReference = '<span>' + goatElement + '</span>'
                        }
                        $('#organisms').append('<tr><td>' + organismElement + '</td><td>' + name + '</td><td>' + trackingStatus + '</td><td>' + externalReference + '</td></tr>');
                    }
                    $('#organismsTable').DataTable({
                        destroy: true
                    });

                    $('#organismsModal').modal({ backdrop: 'static', keyboard: false });
                    $('#organismsModal').modal('show');
                    $(".modal-backdrop").show();

                }
            });
        }
    }

    function update(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function(level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line  
        tree = tree.size([newHeight, viewerWidth]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
            d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
        });

        // Update the nodes…
        node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            // .call(dragListener)
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('click', click);

        nodeEnter.append("circle")
            .attr("id", "circleCustomTooltip")
            .attr('class', 'nodeCircle')
            .attr("r", 0)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                var name;
                name = d.name;
                if ($('#commonName').prop("checked") == true) {
                    if (d.commonName != 'Other')
                        name = d.name + " (" + d.commonName + ")";
                    else
                        name = d.name;
                } else if ($('#commonName').prop("checked") == false) {
                    name = d.name;
                }
                return name;
            })
            .style("fill-opacity", 0);

        // phantom node to give us mouseover in a radius around it
        nodeEnter.append("circle")
            .attr('class', 'ghostCircle')
            .attr("r", 30)
            .attr("opacity", 0.2) // change this to zero to hide the target area
            .style("fill", "red")
            .attr('pointer-events', 'mouseover');

        // Update the text to reflect whether node has children or not.
        node.select('text')
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                var name;
                name = d.name;
                if ($('#commonName').prop("checked") == true) {
                    if (d.commonName != 'Other')
                        name = d.name + " (" + d.commonName + ")";
                    else
                        name = d.name;
                } else if ($('#commonName').prop("checked") == false) {
                    name = d.name;
                }
                return name;
            });

        // Change the circle fill depending on whether it has children and is collapsed
        node.select("circle.nodeCircle")
            .attr("r", 4.5)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        div.transition()
            .duration(200)
            .style("opacity", .9);
        // div.html("<div id='doc' class='row' style='padding-top: 25px;'><div class='col-md-2'></div><div class='col-md-3'>Single click to expand or collapse a node</div><div class='col-md-3'>Double click to show Organisms table</div><div class='col-md-3'>Graph can be zoomed in & out and is draggable</div></div>")
            // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // Fade the text in
        nodeUpdate.select("text")
            .style("fill-opacity", 1);
        nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function(d) {
                if(d.class === "found"){
                    return "#2E8B57"; //red
                }
                else if(d._children){
                    return "lightsteelblue";
                }
                else{
                    return "#fff";
                }
            })
            .style("stroke", function(d) {
                if(d.class === "found"){
                    return "#2E8B57"; //red
                }
            });
        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 0);

        nodeExit.select("text")
            .style("fill-opacity", 0);

        // Update the links…
        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal)
            .style("stroke",function(d){
                if(d.target.class==="found"){
                    return "#2E8B57";
                }
            });

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");

    // Define the root
    root = treeData;
    root.x0 = viewerHeight / 2;
    root.y0 = 0;

    // Collapse all children of roots children before rendering.
    root.children.forEach(function(child) {
        collapse(child);
    });

    // Layout the tree initially and center on the root node.
    update(root);
    centerNode(root);

    $('#reset').on('click', resetGraph)
    $('#commonName').on('click', toggleCommonName)
    $('#searchBox').on('keyup', searchText)

    function searchText() {
        // var svgGroup = baseSvg.append("g");
        root = treeData;
        let input= d3.select("#searchBox").node().value;
        if(input) {
            var paths = searchTree(root, input, []);
            if (typeof (paths) !== "undefined") {
                openPaths(paths);
            } else {
               // alert(input + " not found!");
            }
        }else{
            resetGraph();
        }

    }
    function searchTree(obj,search,path){
        if(obj.name.toLowerCase() === search.toLowerCase()){ //if search is found return, add the object to the path and return it
            path.push(obj);
            return path;
        }else if(obj.commonName.toLowerCase() === search.toLowerCase() ){ //if search is found return, add the object to the path and return it
            path.push(obj);
            return path;
        }
        else if(obj.children || obj._children){ //if children are collapsed d3 object will have them instantiated as _children
            var children = (obj.children) ? obj.children : obj._children;
            for(var i=0;i<children.length;i++){
                path.push(obj);// we assume this path is the right one
                var found = searchTree(children[i],search,path);
                if(found){// we were right, this should return the bubbled-up path from the first if statement
                    return found;
                }
                else{//we were wrong, remove this parent from the path and continue iterating
                    path.pop();
                }
            }
        }
        else{//not the right object, return false so it will continue to iterate in the loop
            return false;
        }
    }

    function openPaths(paths){
        for(var i =0;i<paths.length;i++){
            if(paths[i].id !== "1"){//i.e. not root
                paths[i].class = 'found';
                if(paths[i]._children){ //if children are hidden: open them, otherwise: don't do anything
                    paths[i].children = paths[i]._children;
                    paths[i]._children = null;
                }
                update(paths[i]);
            }
        }
    }
    function clearAll(d) {
        d.class = "";
        if (d.children)
            d.children.forEach(clearAll);
        else if (d._children)
            d._children.forEach(clearAll);
    }
    function toggleCommonName() {
        // var svgGroup = baseSvg.append("g");
        root = treeData;
        // root.x0 = viewerHeight / 2;
        // root.y0 = 0;
        // root.children.forEach(function (child) {
        //     collapse(child);
        // });
        update(root);

    }

    function resetGraph() {
        // Append a group which holds all nodes and which the zoom Listener can act upon.
        var svgGroup = baseSvg.append("g");

        // Define the root
        root = treeData;
        root.x0 = viewerHeight / 2;
        root.y0 = 0;

        // Collapse all children of roots children before rendering.
        root.children.forEach(function(child) {
            collapse(child);
        });
        clearAll(root);
        var zoom = d3.behavior.zoom()
        zoom.scale(zoom.scale() / 2)

        // Layout the tree initially and center on the root node.
        update(root);
        centerNode(root);

    }

    function zoomed() {
        svgGroup.attr("transform",
            "translate(" + zoomListener.translate() + ")" +
            "scale(" + zoomListener.scale() + ")"
        );
    }

    function interpolateZoom(translate, scale) {
        var self = this;
        return d3.transition().duration(350).tween("zoom", function() {
            var iTranslate = d3.interpolate(zoomListener.translate(), translate),
                iScale = d3.interpolate(zoomListener.scale(), scale);
            return function(t) {
                zoomListener.scale(iScale(t)).translate(iTranslate(t));
                zoomed();
            };
        });
    }

    function zoomClick() {
        var clicked = d3.event.target,
            direction = 1,
            factor = 0.2,
            target_zoom = 1,
            center = [viewerWidth / 2, viewerHeight / 2],
            extent = zoomListener.scaleExtent(),
            translate = zoomListener.translate(),
            translate0 = [],
            l = [],
            view = { x: translate[0], y: translate[1], k: zoomListener.scale() };

        d3.event.preventDefault();
        direction = (this.id === 'zoom_in') ? 1 : -1;
        target_zoom = zoomListener.scale() * (1 + factor * direction);

        if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

        translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
        view.k = target_zoom;
        l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

        view.x += center[0] - l[0];
        view.y += center[1] - l[1];

        interpolateZoom([view.x, view.y], view.k);
    }

    d3.select('#zoom_in').on('click', zoomClick);
    d3.select('#zoom_out').on('click', zoomClick);
});

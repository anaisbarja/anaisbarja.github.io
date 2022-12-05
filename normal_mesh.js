
const VERTEX_STRIDE = 48;


class NormalMesh {
    /** 
     * Creates a new mesh and loads it into video memory.
     * 
     * @param {WebGLRenderingContext} gl  
     * @param {number} program
     * @param {number[]} vertices
     * @param {number[]} indices
    */
    constructor(gl, program, vertices, indices, material, use_color) {
        this.verts = create_and_load_vertex_buffer(gl, vertices, gl.STATIC_DRAW);
        this.indis = create_and_load_elements_buffer(gl, indices, gl.STATIC_DRAW);

        this.n_verts = vertices.length / VERTEX_STRIDE * 4;
        this.n_indis = indices.length;
        this.program = program;
        this.material = material;

        this.use_color = use_color ?? false;
    }

    set_vertex_attributes() {
        set_vertex_attrib_to_buffer(
            gl, this.program,
            "coordinates",
            this.verts, 3,
            gl.FLOAT, false, VERTEX_STRIDE, 0
        );

        set_vertex_attrib_to_buffer(
            gl, this.program,
            "color",
            this.verts, 4,
            gl.FLOAT, false, VERTEX_STRIDE, 12
        );

        set_vertex_attrib_to_buffer(
            gl, this.program,
            "uv",
            this.verts, 2,
            gl.FLOAT, false, VERTEX_STRIDE, 28
        );

        set_vertex_attrib_to_buffer(
            gl, this.program,
            "surf_normal",
            this.verts, 3,
            gl.FLOAT, false, VERTEX_STRIDE, 36
        )
    }


    /**
     * Create a box mesh with the given dimensions and colors. Creates normals.
     * @param {WebGLRenderingContext} gl 
     */

    static box(gl, program, width, height, depth, material) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let verts = [
            // back
            hwidth, -hheight, -hdepth, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -1.0,
            -hwidth, -hheight, -hdepth, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, -1.0,
            -hwidth, hheight, -hdepth, 0.5, 0.5, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, -1.0,
            hwidth, hheight, -hdepth, 1.0, 1.0, 0.5, 1.0, 1.0, 0.0, 0.0, 0.0, -1.0,
            // right
            hwidth, -hheight, hdepth, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0,
            hwidth, -hheight, -hdepth, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0,
            hwidth, hheight, -hdepth, 0.5, 0.5, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            hwidth, hheight, hdepth, 1.0, 1.0, 0.5, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
            // front
            -hwidth, -hheight, hdepth, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0,
            hwidth, -hheight, hdepth, 1.0, 1.0, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
            hwidth, hheight, hdepth, 0.5, 0.5, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
            -hwidth, hheight, hdepth, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0,
            // left
            -hwidth, -hheight, hdepth, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, -1.0, 0.0, 0.0,
            -hwidth, -hheight, -hdepth, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 0.0, 0.0,
            -hwidth, hheight, -hdepth, 0.5, 0.5, 1.0, 1.0, 1.0, 0.0, -1.0, 0.0, 0.0,
            -hwidth, hheight, hdepth, 1.0, 1.0, 0.5, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
            // top
            -hwidth, hheight, -hdepth, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,
            hwidth, hheight, -hdepth, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0,
            hwidth, hheight, hdepth, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            -hwidth, hheight, hdepth, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0,
            // bottom
            -hwidth, -hheight, -hdepth, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, -1.0, 0.0,
            hwidth, -hheight, -hdepth, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, -1.0, 0.0,
            hwidth, -hheight, hdepth, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, -1.0, 0.0,
            -hwidth, -hheight, hdepth, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0, 0.0,
        ];

        let indis = [
            // clockwise winding
            0, 3, 2, 2, 1, 0,
            4, 7, 6, 6, 5, 4,
            8, 11, 10, 10, 9, 8,
            12, 13, 14, 14, 15, 12,
            16, 17, 18, 18, 19, 16,
            20, 23, 22, 22, 21, 20,
        ];

        return new NormalMesh(gl, program, verts, indis, material, false);
    }

    /**
     * Create a box mesh but using UV coordinates that support 6-sided texture mapping. 
     * @param {WebGLRenderingContext} gl 
     * @param {number} width 
     * @param {number} height 
     * @param {number} depth 
     */

    static mapped_box(gl, program, width, height, depth, material) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let verts = [
            // front
            hwidth, -hheight, -hdepth, 1.0, 0.0, 1.0, 1.0, .5, .5, 0.0, 0.0, -1.0,
            -hwidth, -hheight, -hdepth, 0.0, 1.0, 1.0, 1.0, .25, .5, 0.0, 0.0, -1.0,
            -hwidth, hheight, -hdepth, 0.5, 0.5, 1.0, 1.0, .25, .25, 0.0, 0.0, -1.0,
            hwidth, hheight, -hdepth, 1.0, 1.0, 0.5, 1.0, .5, .25, 0.0, 0.0, -1.0,
            // right
            hwidth, -hheight, hdepth, 1.0, 0.0, 1.0, 1.0, .75, .5, 1.0, 0.0, 0.0,
            hwidth, -hheight, -hdepth, 0.0, 1.0, 1.0, 1.0, .5, .5, 1.0, 0.0, 0.0,
            hwidth, hheight, -hdepth, 0.5, 0.5, 1.0, 1.0, .5, .25, 1.0, 0.0, 0.0,
            hwidth, hheight, hdepth, 1.0, 1.0, 0.5, 1.0, .75, .25, 1.0, 0.0, 0.0,
            // back
            -hwidth, -hheight, hdepth, 1.0, 0.0, 1.0, 1.0, 1, .5, 0.0, 0.0, 1.0,
            hwidth, -hheight, hdepth, 1.0, 1.0, 0.5, 1.0, .75, .5, 0.0, 0.0, 1.0,
            hwidth, hheight, hdepth, 0.5, 0.5, 1.0, 1.0, .75, .25, 0.0, 0.0, 1.0,
            -hwidth, hheight, hdepth, 0.0, 1.0, 1.0, 1.0, 1, .25, 0.0, 0.0, 1.0,
            // left
            -hwidth, -hheight, hdepth, 1.0, 0.0, 1.0, 1.0, 0, .5, -1.0, 0.0, 0.0,
            -hwidth, -hheight, -hdepth, 0.0, 1.0, 1.0, 1.0, 0.25, .5, -1.0, 0.0, 0.0,
            -hwidth, hheight, -hdepth, 0.5, 0.5, 1.0, 1.0, 0.25, .25, -1.0, 0.0, 0.0,
            -hwidth, hheight, hdepth, 1.0, 1.0, 0.5, 1.0, 0, .25, -1.0, 0.0, 0.0,

            // top
            -hwidth, hheight, -hdepth, 1.0, 0.0, 0.0, 1.0, .25, .25, 0.0, 1.0, 0.0,
            hwidth, hheight, -hdepth, 0.0, 1.0, 0.0, 1.0, .5, .25, 0.0, 1.0, 0.0,
            hwidth, hheight, hdepth, 0.0, 0.0, 1.0, 1.0, .5, 0, 0.0, 1.0, 0.0,
            -hwidth, hheight, hdepth, 1.0, 1.0, 0.0, 1.0, .25, 0, 0.0, 1.0, 0.0,
            // bottom
            -hwidth, -hheight, -hdepth, 1.0, 0.0, 0.0, 1.0, .5, .75, 0.0, -1.0, 0.0,
            hwidth, -hheight, -hdepth, 0.0, 1.0, 0.0, 1.0, .25, .75, 0.0, -1.0, 0.0,
            hwidth, -hheight, hdepth, 0.0, 0.0, 1.0, 1.0, .25, .5, 0.0, -1.0, 0.0,
            -hwidth, -hheight, hdepth, 1.0, 1.0, 0.0, 1.0, .5, .5, 0.0, -1.0, 0.0,
        ];

        let indis = [
            // clockwise winding
            0, 3, 2, 2, 1, 0,
            4, 7, 6, 6, 5, 4,
            8, 11, 10, 10, 9, 8,
            12, 13, 14, 14, 15, 12,
            16, 17, 18, 18, 19, 16,
            20, 23, 22, 22, 21, 20,
        ];

        return new NormalMesh(gl, program, verts, indis, material);
    }


    /**
     * Create a flat platform in the xz plane.
     * @param {WebGLRenderingContext} gl 
     */
    static platform(gl, program, width, depth, uv_min, uv_max, material) {
        let hwidth = width / 2;
        let hdepth = depth / 2;

        let verts = [
            -hwidth, 0, -hdepth, 1.0, 1.0, 1.0, 1.0, uv_min, uv_max, 0.0, 1.0, 0.0,
            hwidth, 0, -hdepth, 1.0, 1.0, 1.0, 1.0, uv_max, uv_max, 0.0, 1.0, 0.0,
            hwidth, 0, hdepth, 1.0, 1.0, 1.0, 1.0, uv_max, uv_min, 0.0, 1.0, 0.0,
            -hwidth, 0, hdepth, 1.0, 1.0, 1.0, 1.0, uv_min, uv_min, 0.0, 1.0, 0.0,
        ];

        let indis = [0, 1, 2, 2, 3, 0,];

        return new NormalMesh(gl, program, verts, indis, material, false);
    }

    /**
     * Create a terrain.
     * @param {WebGLRenderingContext} gl 
     */
    static terrain(gl, program, scale, roughness, material) {
        let map1 = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 1, 2, 3, 2, 1, 0, 1, 1, 0],
            [0, 1, 2, 3, 2, 1, 0, 1, 1, 0],
            [0, 0, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 1, 2, 3, 2, 1, 0, 1, 1, 0],
            [0, 1, 2, 3, 2, 1, 0, 1, 1, 0],
            [0, 0, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ]
        let map2 = [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 1, 2, 0],
            [0, 0, 0, 0],

        ]
        // let actualMax = 3
        let actualMin = 0
        let actualMax = 0

        function heightmap(scale) {
            let size = Math.pow(2, scale) + 1
            // console.log(size) //scale 6 = 65
            let map = []
            for (let i = 0; i < size; i++) {
                let row = []
                for (let j = 0; j < size; j++) {
                    row.push(null)
                }
                map.push(row)
            }

            // console.log(map)
            let corners = [[0, 0], [size - 1, 0], [0, size - 1], [size - 1, size - 1]]

            for (let corner of corners) {
                map[corner[0]][corner[1]] = Math.random() * (roughness - (-roughness)) + (-roughness);
            }

            // let midRow = size/2
            // let midCol = size/2
            //start flat side
            // map[0][0] = 0
            // map[0][size - 1] = 0
            // map[size - 1][0] = Math.random() * (roughness - (0)) + (0);
            // map[size - 1][size - 1] = Math.random() * (0 - (-roughness)) + (-roughness);



            function fillIn(centerX, centerY, travel, roughness) {
                // console.log("call again", centerX, centerY, travel)

                if (map[centerX][centerY] != null) {
                    return
                }

                // get the average of 4 corners
                let mid = (map[centerX - travel][centerY - travel] + map[centerX + travel][centerY - travel] + map[centerX - travel][centerY + travel] + map[centerX + travel][centerY + travel]) / 4

                // console.log(map[centerX-travel][centerY-travel], map[centerX+travel][centerY-travel], map[centerX-travel][centerY+travel], map[centerX+travel][centerY+travel] )
                let random_offset = Math.random() * (roughness - (-roughness)) + (-roughness);
                mid += random_offset

                // assign mid to center
                map[centerX][centerY] = mid

                // get the n,s,e,w points
                let centerPoints = [[centerX - travel, centerY], [centerX + travel, centerY], [centerX, centerY + travel], [centerX, centerY - travel]]
                // console.log("center points", centerPoints)


                for (let centerPoint of centerPoints) {
                    let cardinalPoints = [
                        [centerPoint[0], centerPoint[1] + travel],//down
                        [centerPoint[0], centerPoint[1] - travel],//up
                        [centerPoint[0] + travel, centerPoint[1]],//right
                        [centerPoint[0] - travel, centerPoint[1]]//left
                    ]
                    let mid = 0
                    let divAmount = 4
                    for (let cardinalPoint of cardinalPoints) {

                        let row = map[cardinalPoint[0]]

                        if (row == undefined) {
                            mid += 0
                            divAmount--
                        } else {
                            let value = map[cardinalPoint[0]][cardinalPoint[1]]
                            if (value == undefined) {
                                mid += 0
                                divAmount--
                            } else {
                                mid += value
                            }
                        }
                    }
                    mid = mid / divAmount

                    let random_offset = Math.random() * (roughness - (-roughness)) + (-roughness);
                    // console.log(random_offset, roughness, "help")
                    mid += random_offset
                    map[centerPoint[0]][centerPoint[1]] = mid
                }

                travel = travel / 2
                if (travel < 1) {
                    return
                }

                // top left
                fillIn(centerX - travel, centerY + travel, travel, roughness * 2 / 3)
                // top right
                fillIn(centerX + travel, centerY + travel, travel, roughness * 2 / 3)
                // bottom left
                fillIn(centerX - travel, centerY - travel, travel, roughness * 2 / 3)
                // bottom right
                fillIn(centerX + travel, centerY - travel, travel, roughness * 2 / 3)

                // console.log(map)
            }

            let travel = (size - 1) / 2
            let centerX = (size - 1) / 2
            let centerY = (size - 1) / 2


            fillIn(centerX, centerY, travel, roughness * 2 / 3)

            // travel = travel / 2
            // // top left
            // fillIn(centerX - travel, centerY + travel, travel)
            // // top right
            // fillIn(centerX + travel, centerY + travel, travel)
            // // bottom left
            // fillIn(centerX - travel, centerY - travel, travel)
            // // bottom right
            // fillIn(centerX + travel, centerY - travel, travel)


            for (let i = 0; i < map.length; i++) {
                let currMin = Math.min(...map[i])
                let currMax = Math.max(...map[i])
                if (currMin < actualMin) {
                    actualMin = currMin
                }
                if (currMax > actualMax) {
                    actualMax = currMax
                }
            }
            console.log(actualMax, actualMin)

            // let leveledRow = []

            // for (let j = 0; j < size; j++) {
            //     leveledRow.push(0.1)
            // }
            // map.unshift(leveledRow)
            // map.unshift(leveledRow)
            // map.unshift(leveledRow)
            // map.unshift(leveledRow)


            // let miniMap = []

            // for (let i = 0; i < map.length; i++) {
            //     miniMap.push(map[i].map(val => Math.round(val * 100) / 100))
            // }
            // console.log(map)
            // console.log(miniMap)


            let flatSize = 12
            let flatRoughness = 3
            let start = Math.round((size / 2) - (flatSize / 2))
            let end = Math.round(start + flatSize)

            // console.log(size, start, end)
            // let iteration=0
            for (let row = start; row < end; row++) {
                let startExtra = Math.round(Math.random() * (flatRoughness - (0)) + (0));
                let endExtra = Math.round(Math.random() * (flatRoughness - (0)) + (0) + startExtra);

                // startExtra = 0
                // endExtra = 0

                // console.log("chosen", start - startExtra, end + endExtra)
                for (let col = start - startExtra; col < end + endExtra; col++) {
                    map[row][col] = 1
                }
            }

            for (let col = start; col < end; col++) {
                let startExtra = Math.round(Math.random() * (flatRoughness - (0)) + (0));
                let endExtra = Math.round(Math.random() * (flatRoughness - (0)) + (0) + startExtra);

                // startExtra = 0
                // endExtra = 0

                // console.log("chosen", start - startExtra, end + endExtra)
                for (let row = start - startExtra; row < end + endExtra; row++) {
                    map[row][col] = 1
                }
            }


            return map


        }
        return this.from_heightmap(gl, program, heightmap(scale), actualMin, actualMax, material)
    }

    /**
     * Load a mesh from a heightmap.
     * @param {WebGLRenderingContext} gl 
     * @param {WebGLProgram} program
     * @param {number][][]} map
     * @param {number} min 
     * @param {number} max
     */
    static from_heightmap(gl, program, map, min, max, material) {
        let rows = map.length;
        let cols = map[0].length;
        const MIN_HEIGHT_COLOR = 0.2;

        let off_x = cols / 2;
        let off_z = rows / 2;

        let verts = [];
        let indis = [];

        function color(height) {
            let normed_height = height / (max - min);
            return MIN_HEIGHT_COLOR + normed_height * (1 - MIN_HEIGHT_COLOR);
        }

        function push_vert(verts, vert, u, v, normal) {
            // let relativeHeight = (vert.y / actualMax) * max
            // verts.push(vert.x, relativeHeight, vert.z);
            verts.push(vert.x, vert.y, vert.z);
            let vert_bright = color(vert.y);
            verts.push(vert_bright, vert_bright, vert_bright, 1.0);
            verts.push(u, v);
            verts.push(normal.x, normal.y, normal.z);
        }

        for (let row = 1; row < rows; row++) {
            for (let col = 1; col < cols; col++) {
                let indi_start = indis.length;

                let pos_tl = map[row - 1][col - 1];
                let pos_tr = map[row - 1][col];
                let pos_bl = map[row][col - 1];
                let pos_br = map[row][col];

                let v_tl = new Vec4(-1, pos_tl, -1);
                let v_tr = new Vec4(0, pos_tr, -1);
                let v_bl = new Vec4(-1, pos_bl, 0);
                let v_br = new Vec4(0, pos_br, 0);

                let normal_t1 = Vec4.normal_of_triangle(v_tl, v_tr, v_bl);
                let normal_t2 = Vec4.normal_of_triangle(v_br, v_bl, v_tr);

                // debug
                // normal_t1 = new Vec4( 0, 1, 0 );
                // normal_t2 = new Vec4( 0, 1, 0 );

                v_tl.x += col - off_x;
                v_tl.z += row - off_z;
                v_tr.x += col - off_x;
                v_tr.z += row - off_z;
                v_bl.x += col - off_x;
                v_bl.z += row - off_z;
                v_br.x += col - off_x;
                v_br.z += row - off_z;

                push_vert(verts, v_tl, 0, 1, normal_t1);
                push_vert(verts, v_tr, 1, 1, normal_t1);
                push_vert(verts, v_bl, 0, 0, normal_t1);

                push_vert(verts, v_br, 1, 0, normal_t2);
                push_vert(verts, v_bl, 0, 0, normal_t2);
                push_vert(verts, v_tr, 1, 1, normal_t2);

                indis.push(
                    indi_start,
                    indi_start + 1,
                    indi_start + 2,
                    indi_start + 3,
                    indi_start + 4,
                    indi_start + 5
                );
            }
        }

        return new NormalMesh(gl, program, verts, indis, material, true);
    }

    /**
     * Render the mesh. Does NOT preserve array/index buffer, program, or texture bindings! 
     * 
     * @param {WebGLRenderingContext} gl 
     */
    render(gl) {
        // gl.enable( gl.CULL_FACE );

        gl.useProgram(this.program);
        this.set_vertex_attributes();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verts);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indis);
        bind_texture_samplers(gl, this.program, "tex_0");

        gl.activeTexture(gl.TEXTURE0);
        this.material.bind(gl, this.program);

        set_uniform_int(gl, this.program, 'use_color', this.use_color);

        gl.drawElements(gl.TRIANGLES, this.n_indis, gl.UNSIGNED_SHORT, 0);
    }

    /**
     * Create a UV sphere.
     * @param {*} gl 
     * @param {*} program 
     * @param {*} radius 
     * @param {*} subdivs the number of subdivisions, both vertically and radially
     * @param {*} material 
     * @returns 
     */
    static uv_sphere(gl, program, radius, subdivs, material) {
        if (subdivs < 3) {
            throw new Error("subdivs must be at least 3. value: " + subdivs);
        }

        let verts = []
        let indis = []

        for (let layer = 0; layer <= subdivs; layer++) {
            // let y = layer / subdivs - 0.5;
            let y_turns = layer / subdivs / 2;
            let y = Math.cos(2 * Math.PI * y_turns) / 2;
            let radius_scale_for_layer = Math.sin(2 * Math.PI * y_turns);

            for (let subdiv = 0; subdiv <= subdivs; subdiv++) {
                let turns = subdiv / subdivs;
                let rads = 2 * Math.PI * turns;

                let x = Math.cos(rads) / 2 * radius_scale_for_layer;
                let z = Math.sin(rads) / 2 * radius_scale_for_layer;

                let point_norm = new Vec4(x, y, z, 0.0).norm();
                let scaled_point = point_norm.scaled(radius);

                // coordinates
                verts.push(scaled_point.x, scaled_point.y, scaled_point.z);

                // console.log( layer, subdiv, scaled_point.x, scaled_point.y, scaled_point.z );

                // color (we're making it white for simplicity)
                verts.push(1, 1, 1, 1);

                // uvs
                verts.push(subdiv / subdivs, layer / subdivs);

                // normal vector. make sure you understand why the normalized coordinate is 
                // equivalent to the normal vector for the sphere.
                verts.push(point_norm.x, point_norm.y, point_norm.z);
            }
        }

        function get_indi_no_from_layer_and_subdiv_no(layer, subdiv) {
            let layer_start = layer * (subdivs + 1);
            return layer_start + subdiv % (subdivs + 1);
        }

        for (let layer = 1; layer <= subdivs; layer++) {
            for (let subdiv = 0; subdiv < subdivs; subdiv++) {
                let i0 = get_indi_no_from_layer_and_subdiv_no(layer - 1, subdiv);
                let i1 = get_indi_no_from_layer_and_subdiv_no(layer - 1, subdiv + 1);
                let i2 = get_indi_no_from_layer_and_subdiv_no(layer, subdiv);
                let i3 = get_indi_no_from_layer_and_subdiv_no(layer, subdiv + 1);

                indis.push(i0, i2, i3, i3, i1, i0);
            }
        }

        return new NormalMesh(gl, program, verts, indis, material, false);
    }

    /**
     * Parse the given text as the body of an obj file.
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram} program
     * @param {string} text
     */
    static from_obj_text(gl, program, text, material) {
        // create verts and indis from the text

        let verts = [];
        let indis = [];

        // YOUR CODE GOES HERE

        let lines = text.split(/\r?\n/);

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            line.trim();
            let parts_of_line = line.split(" ");
            if (parts_of_line[0] == "v") {
                verts.push(...parts_of_line.slice(1, 13).map(Number));
            } else if (parts_of_line[0] == "f") {
                let faceArr = parts_of_line.slice(1, 4).map(Number);
                for (let i = 0; i < faceArr.length; i++) {
                    faceArr[i]--;
                }
                indis.push(...faceArr);
            }
        }
        return new NormalMesh(gl, program, verts, indis, material, false);
        //   return new Mesh(gl, program, verts, indis, xor_texture());
    }

    /**
   * Asynchronously load the obj file as a mesh.
   * @param {WebGLRenderingContext} gl
   * @param {string} file_name
   * @param {WebGLProgram} program
   * @param {function} f the function to call and give mesh to when finished.
   */
    static from_obj_file(gl, file_name, program, material) {
        let request = new XMLHttpRequest();

        // the function that will be called when the file is being loaded
        request.onreadystatechange = function () {
            // console.log( request.readyState );

            if (request.readyState != 4) {
                return;
            }
            if (request.status != 200) {
                throw new Error("HTTP error when opening .obj file: ", request.statusText);
            }

            // now we know the file exists and is ready
            // load the file
            let loaded_mesh = NormalMesh.from_obj_text(gl, program, request.responseText, material);

            console.log("loaded ", file_name);
            // f(loaded_mesh);
            Object.assign(obj, loaded_mesh)

        };

        request.open("GET", file_name); // initialize request.
        request.send(); // execute request

        let obj = NormalMesh.platform(gl, program, 1, 1, 0, 1, material)

        return obj;
    }
}
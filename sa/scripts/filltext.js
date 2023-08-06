;(function(o, undefined){
    'use strict'

    /**
     * filltext() returns randomly selected sentences of 'Lorem ipsum'.
     * 
     * @param {integer} sentences 
     */
    o.filltext = (sentences) => {
        var txt = '', lorem_ipsum = ''
        lorem_ipsum=['Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.', 'Maecenas luctus libero id justo. Curabitur nibh pede, dignissim pharetra, ullamcorper nec, scelerisque in, justo.', 'Donec autem vel ac dolor venenatis. In hac habitasse platea dictumst. Pellentesque tortor iusto, vulputate diam.', 'Aliquam nisi et augue consectetuer, lacus ut cursus ornare, elit mauris pellentesque quam, vitae luctus erat nunc vel massa.'];
        for (var i=0; i < sentences; i++) txt += lorem_ipsum[Math.floor(Math.random()*4)] + ' '
        
        return txt
    }
    // Usage
    /*
        nodeFoo.innerHTML = `${$.filltext(8)}`
    */

})( window[__APP__] = window[__APP__] || {} )

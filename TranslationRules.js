var NAMFox = NAMFox || {};

NAMFox.translationRules = [
    {
        name: "Edit tags",
        regexp: /(?:<br \/><br \/>)?<div[^>]*?class="small right"[^>]*?>[^<]*?Edit[^<]*?<\/div><br \/><\/div>$/m,
        replacement: ""
    },
    {
        name: "Moderation queue messages",
        regexp: /<p> \[ Check <a href=".*?\/index.php\?fn=moderation_queue\&amp;f=\d+">moderation queue<\/a> to see who reported this post \] (?:<\/p>)?\s*$/m,
        replacement: ""
    },
    {
        name: "Moderation queue messages (2)",
        regexp: /<p> \[ This message has been moved to the <a href=".*?\/index.php\?fn=moderation_queue\&amp;f=\d+">moderation queue<\/a> and is being shown to you due to your moderator status \] <\/p>\s*$/m,
        replacement: ""
    },
    {
        name: "Mail links",
        regexp: /<a href="mailto:(.*?)" target="_blank">\1<\/a>/gm,
        replacement: "$1"
    },
    {
        name: "Quote 1",
        regexp: /<blockquote(?: style="color: #222266")?><font size=1>quote <b><a href="\/forums\/directmessage.php\?m=(\d+)" target="_blank">(.*?)<\/a><\/b><br \/><\/font><div class="qt">/gm,
        replacement: "[quote=$2|message:$1]"
    },
    {
        name: "Quote 2",
        regexp: /<blockquote(?: style="color: #222266")?><font size=1>quote <b><a href="(.*?)" target="_blank">(.*?)<\/a><\/b><br \/><\/font><div class="qt">/gm,
        replacement: "[quote=$2|$1]"
    },
    {
        name: "Quote 3",
        regexp: /<blockquote(?: style="color: #222266")?><font size=1>quote <b><a href="(.*?)" target="_blank">(.*?)<\/b><br \/><\/font><div class="qt"><\/a>/gm,
        replacement: "[quote][originator=[link name=$2]]$1[/link]"
    },
    {
        name: "Quote 4",
        regexp: /<blockquote(?: style="color: #222266")?><font size=1>quote <b>(.*?)<\/b><br \/><\/font><div class="qt">/gm,
        replacement: "[quote=$1]"
    },
    {
        name: "Quote 5",
        regexp: /<blockquote(?: style="color: #222266")?><font size=1>quote<\/font><div class="qt">/gm,
        replacement: "[quote]"
    },
    {
        name: "End Quote",
        regexp: /<\/div><\/blockquote>/gm,
        replacement: "[/quote]\n\n"
    },
    {
        name: "Code tag",
        regexp: /<table width="90%"><tr><td><font size=1>code<\/font><\/td><\/tr><tr><td[^>]*? class="code"><pre[^>]*?>([\s\S]*?)\n?<\/pre><\/td><\/tr><\/table>(<!-- endcode \d+ -->)?/gim,
        replacement: "[code]$1\n[/code]"
    },
    {
        name: "PHP colorization",
        callFunction: "_stripPhpFontTags"
    },
    {
        name: "PHP tag",
        regexp: /<table width="90%"><tr><td><font size=1>php code<\/font><\/td><\/tr><tr><td.*? class="code"><pre.*?><code>\s*([\s\S]*?)\s*<\/code><\/pre><\/td><\/tr><\/table>(<!-- endphpcode \d+ -->)?/gim,
        replacement: "[php]\n$1\n[/php]"
    },
    {
        name: "New lines",
        regexp: /<br(?: \/)?>/gim,
        replacement: "\n"
    },
    {
        name: "Header 1",
        regexp: /<h1>([\s\S]*?)<\/h1>/gim,
        replacement: "!$1"
    },
    {
        name: "Header 2",
        regexp: /<h2>([\s\S]*?)<\/h2>/gim,
        replacement: "!!$1"
    },
    {
        name: "Header 3",
        regexp: /<h3>([\s\S]*?)<\/h3>/gim,
        replacement: "!!!$1"
    },
    {
        name: "Header 4",
        regexp: /<h4>([\s\S]*?)<\/h4>/gim,
        replacement: "!!!!$1"
    },
    {
        name: "Header 5",
        regexp: /<h5>([\s\S]*?)<\/h5>/gim,
        replacement: "!!!!!$1"
    },
    {
        name: "Wiki Header 1",
        regexp: /<h1 class="mw_heading">([\s\S]*?)<!-- mw_heading --><\/h1>/gim,
        replacement: "=$1="
    },
    {
        name: "Wiki Header 2",
        regexp: /<h2 class="mw_heading">([\s\S]*?)<!-- mw_heading --><\/h2>/gim,
        replacement: "==$1=="
    },
    {
        name: "Wiki Header 3",
        regexp: /<h3 class="mw_heading">([\s\S]*?)<!-- mw_heading --><\/h3>/gim,
        replacement: "===$1==="
    },
    {
        name: "Wiki Header 4",
        regexp: /<h4 class="mw_heading">([\s\S]*?)<!-- mw_heading --><\/h4>/gim,
        replacement: "====$1===="
    },
    {
        name: "Wiki Header 5",
        regexp: /<h5 class="mw_heading">([\s\S]*?)<!-- mw_heading --><\/h5>/gim,
        replacement: "=====$1====="
    },
    {
        name: "Anchor link",
        regexp: /<a href="#(.*?)">([\s\S]*?)<\/a>/gim,
        replacement: "[[#$1|$2]]"
    },
    {
        name: "Anchor",
        regexp: /<a name="(.*?)" id="\1"><\/a>/gim,
        replacement: "[[#$1]]"
    },
    {
        name: "Link cleanup",
        regexp: /<a href="\/members\/([^\/]*)(?:\+|%20)([^\/]*?)\/" target="_blank">([^<]*?)<\/a>/gim,
        replacement: '<a href="/members/$1 $2/" target="_blank">$3</a>',
        repeatTillMatchless: true
    },
    {
        name: "Member tag",
        regexp: /<a href="\/members\/([^\/]*?)\/" target="_blank">\1<\/a>/gim,
        replacement: "[[member:$1]]"
    },
    {
        name: "Member with alias tag",
        regexp: /<a href="\/members\/([^\/]*?)\/" target="_blank">([^<]*?)<\/a>/gim,
        replacement: "[[member:$1|$2]]"
    },
    {
        name: "Link space cleanup for PM tags",
        regexp: /(<a href="\/forums\/index.php\?fn=send_pm(?:_thread)?\&amp;manual_username=)([^"]*?)(?:\+|%20)([^"]*?)(\&amp;title=[^"]*?)?" target="_blank">([^<]*?)<\/a>/gim,
        replacement: '$1$2 $3$4" target="_blank">$5</a>',
        repeatTillMatchless: true
    },
    {
        name: "PM tags with subject lines",
        regexp: /<a href="\/forums\/index.php\?fn=send_pm(?:_thread)?\&amp;manual_username=([^"]*?)\&amp;title=([^"]*?)" target="_blank">\1<\/a>/gim,
        replacement: "[[pm:$1|subject:$2]]"
    },
    {
        name: "PM tags with subject lines, whose link name does not match the recipient name",
        regexp: /<a href="\/forums\/index.php\?fn=send_pm(?:_thread)?\&amp;manual_username=([^"]*?)\&amp;title=([^"]*?)" target="_blank">([^<]*?)<\/a>/gim,
        replacement: "[[pm:$1|subject:$2|$3]]"
    },
    {
        name: "PM tags without subject lines",
        regexp: /<a href="\/forums\/index.php\?fn=send_pm(?:_thread)?\&amp;manual_username=([^"]*?)" target="_blank">\1<\/a>/gim,
        replacement: "[[pm:$1]]"
    },
    {
        name: "PM tags without subject lines, whose link name does not match the recipient name",
        regexp: /<a href="\/forums\/index.php\?fn=send_pm(?:_thread)?\&amp;manual_username=([^"]*?)" target="_blank">([^<]*?)<\/a>/gim,
        replacement: "[[pm:$1|$2]]"
    },
    {
        name: "Old spoilers",
        regexp: /<div class="spoiler_header"><b>Spoiler:<\/b> <span class="spoilertitle">(.*?)<\/span><\/div><div class="spoiler"><div><span class="tip">Highlight this box with your cursor to read the spoiler text.<\/span><hr>([\s\S]*?)<\/div><\/div>/gim,
        replacement: "[spoiler=$1]$2[/spoiler]"
    },
    {
        name: "Spoilers",
        regexp: /<noscript><div class="spoiler_header"><b>Spoiler:<\/b> <span class="spoilertitle">(.*?)<\/span><\/div><div class="spoiler"><div><span class="tip">Highlight this box with your cursor to read the spoiler text.<\/span><hr \/>([\s\S]*?)<\/div><\/div><\/noscript><script type="text\/javascript">document.writeln\('<div><div class="spoiler_header"><input type="button" class="forum_button" value="(?:Show|Hide) Spoiler" onclick="flipshow\(this.parentNode.parentNode\)" \/> <strong>Spoiler:<\/strong><span class="spoilertitle">.*?<\/span><div class="spoiler" style="display:none"><div class="show_spoiler"><hr \/>[\s\S]*?<\/div><\/div><\/div><\/div>'\);<\/script>(<\/.*?>)?(?:<div><div class="spoiler_header">.*?<input class="forum_button" value="Show Spoiler" onclick="flipshow\(this.parentNode.parentNode\)" type="button"> <strong>Spoiler:<\/strong><span class="spoilertitle">  .*?<\/span>.*?<div class="spoiler" style="display: none;"><div class="show_spoiler"><hr>[\s\S]*?<\/div><\/div><\/div><\/div>)?/gm,
        replacement: "[spoiler=$1]$2[/spoiler]$3"
    },
    {
        name: "Spoilers",
        regexp: /<noscript><div class="spoiler_header"><b>Spoiler:<\/b> <span class="spoilertitle">(.*?)<\/span><\/div><div class="spoiler"><div><span class="tip">Highlight this box with your cursor to read the spoiler text.<\/span><hr \/>([\s\S]*?)<\/div><\/div><\/noscript><div class="spoiler_header" style="display: none;">.*?<input type="button" name="js_spoiler" class="forum_button" value="(?:Show|Hide) Spoiler" onclick="flipshow\(this\)" \/><strong>Spoiler:<\/strong><span class="spoilertitle">.*?<\/span>.*?<div class="spoiler" style="display:none"><div class="show_spoiler"><hr \/>[\s\S]*?<\/div><\/div><\/div>.*?<script type="text\/javascript">var elements = document.getElementsByName\("js_spoiler"\); find_spoiler_root\(elements\[elements.length - 1\]\).style.display = "block";<\/script>/gm,
        replacement: "[spoiler=$1]$2[/spoiler]"
    },
    {
        name: "New bold tag",
        regexp: /<(\/)?strong>/gim,
        replacement: "[$1b]"
    },
    {
        name: "New italics tag",
        regexp: /<(\/)?em>/gim,
        replacement: "[$1i]"
    },
    {
        name: "New strike out tag",
        regexp: /<(\/)?del>/gim,
        replacement: "[$1strike]"
    },
    {
        name: "Wiki-style lists",
        callFunction: "_replaceLists"
    },
    {
        name: "Literally translated tags",
        regexp: /<(\/)?(b|i|u|sup|sub|pre|[ou]l)>/gim,
        replacement: "[$1$2]"
    },
    {
        name: "Legacy list item tags",
        regexp: /<li>/gm,
        replacement: "[li]"
    },
    {
        name: "HTML5 yt tags",
        regexp: /<!-- yt --><iframe[^>]*?src="https:\/\/www.youtube.com\/embed\/(.*?)\?wmode=transparent".*?><\/iframe><!-- \/yt -->/gm,
        replacement: "[yt]$1[/yt]"
    },
    {
        name: "HTML5 youtube tags",
        regexp: /<iframe[^>]*?src="https:\/\/www.youtube.com\/embed\/(.*?)\?wmode=transparent".*?><\/iframe>/gm,
        replacement: "[youtube]$1[/youtube]"
    },
    {
        name: "Embedded youtube videos",
        regexp: /<object.*?>.*?value="http:\/\/www.youtube.com\/v\/(.*?)">.*?<\/object>/gm,
        replacement: "[youtube]$1[/youtube]"
    },
    {
        name: "Color",
        regexp: /<span style="color:\s*(\S*?);">/gm,
        replacement: "[color=$1]"
    },
    {
        name: "End color",
        regexp: /<\/span>/gim,
        replacement: "[/color]"
    },
    {
        name: "Opening size tag",
        regexp: /<font size="?(.*?)"?>/gim,
        replacement: "[size=$1]"
    },
    {
        name: "Closing size tag",
        regexp: /<\/font>/gim,
        replacement: "[/size]"
    },
    {
        name: "Internal link cleansing",
        regexp: /<a href="([^h].*?)">(.*?)<\/a>/gm,
        replacement: '<a href="http://www.neoseeker.com$1">$2</a>'
    },
    {
        name: "Image links",
        regexp: /<a href="(.*?)".*?><img src="(.*?)" border="1".*? \/><\/a>/gim,
        replacement: "[img link=$1]$2[/img]"
    },
    {
        name: "Smileys",
        callFunction: "_replaceSmileys",
        argument: {
            regexp: /<img src="http:\/\/staticneo.com\/neoassets\/smileys\/([^.]*?)\.(?:gif|png)"[^>]*?vspace[^>]*?>/gim,
            smileyMap: {
                animangry: ':angry:',
                thicksmile: ':thick:',
                coloredsmile: ':colored:',
                animesmile: '^_^',
                embarrassed: ':o',
                mad: ':#',
                cool: ':cool:',
                confused: ':confused:',
                bigsmile: ':D',
                cry: ';(',
                nosmile: ':|',
                sad: ':(',
                wink: ';)',
                a_tongue: ':P',
                smile: ':)',
                ashamed: ':ashamed:',
                hypno: ':hypno:',
                puke: ':_puke:',
                sonic: ':sonic:',
                sonicshadow: ':sonicshadow:',
                huh: 'o_O',
                a_laugh: ':laugh:',
                angelwings: ':angelwings:',
                devil2: ':_devil2:',
                angel: ':angel:',
                blackeye: ':blackeye:',
                dead: ':_dead:',
                devil: ':_devil:',
                eating: ':eating:',
                phantom: ':_phantom:',
                rainbow: ':rainbow:',
                sleeping: ':sleeping:',
                annoyed: ':annoyed:',
                oO: 'o.O',
                closed_eyes: unescape("%u00AC") + '_' + unescape("%u00AC"),
                dumbfounded: ':_dumbfounded:',
                blinky_eyes: ':blinkyeyes:',
                rolleyes: ':rolleyes:',
                moony: ':moony:',
                oooh: ':_oooh:',
                shifty: ':shifty:',
                oops: ':_oops:',
                notamused: ':notamused:',
                whatever: ':whatever:',
                suikia_smiley: ':suikiasmile:',
                coolcat: ':coolcat:',
                lock: ':lock:',
                redanger: ':redanger:',
                redfrag: ':frag:',
                skully8ball: ':skully8:',
                "ps/Tri": ':_ps_tri:',
                "ps/O": ':_ps_circle:',
                "ps/X": ':_ps_x:',
                "ps/[]": ':_ps_[]:',
                "ps/Up": ':_ps_up:',
                "ps/Right": ':_ps_right:',
                "ps/Down": ':_ps_down:',
                "ps/Left": ':_ps_left:',
                "ps/L1": ':_ps_l1:',
                "ps/L2": ':_ps_l2:',
                "ps/R1": ':_ps_r1:',
                "ps/R2": ':_ps_r2:',
                epic: ':epic:',
                bigfrown: ':bigfrown:',
                nothappy: ':nothappy:',
                ninja: ':ninja:',
                xd: ':XD;',
                pointy1: ':_pointy1:',
                pointy2: ':_pointy2:',
                shocked: ':shocked:',
                salty: ':salty:',
                reallyhappy: ':happy:',
                heart: '<3;',
                brokenheart: '</3;',
                yoshi: ':yoshi:',
                pokeball: ':_pokeball:',
                kirby: ":kirby:",
                "1up": ":1up:",
                shroom: ":shroom:",
                yinyang: ":yinyang:",
                triforce: ":triforce:",
                mario: ":mario:",
                luigi: ":luigi:",
                samus: ":samus:",
                snake: ":snake:",
                meteormateria: ":meteormateria:",
                holymateria: ":holymateria:"
            }
        }
    },
    {
        name: "faqimg tag",
        regexp: /<a href="http:\/\/img.neoseeker.com\/v_vfaq_image\.php\?id=(\d+)" class="faqimage"><img src="(.*?)" \/><\/a>/gim,
        replacement: "[faqimg=$1]$2[/faqimg]"
    },
    {
        regexp: /<img.*?src="(.*?)".*?>/gim,
        replacement: '[img]$1[/img]'
    },
    {
        name: "@ mentions for single-word names",
        // The real HTML doesn't have the host name in the URL,
        // but the earlier "Internal link cleansing rule" changes that.
        regexp: /<a href="http:\/\/www.neoseeker.com\/members\/[^\/]*?\/" class="mention">(\S*?)<\/a>/gm,
        replacement: "@$1"
    },
    {
        name: "@ mentions for multiple-word names",
        // The real HTML doesn't have the host name in the URL,
        // but the earlier "Internal link cleansing rule" changes that.
        regexp: /<a href="http:\/\/www.neoseeker.com\/members\/[^\/]*?\/" class="mention">([\s\S]*?)<\/a>/gm,
        replacement: "@$1@"
    },
    {
        name: "Wiki-style links",
        regexp: /<a href="([^"]*?)" target="_blank"[^>]*?class="wikianchor">(.*?)<\/a>/gim,
        replacement: "[$1 $2]"
    },
    {
        name: "Links without names",
        regexp: /<a href="([^"]*?)"[^>]*?>\1<\/a>/gim,
        replacement: "$1"
    },
    {
        name: "Links with names",
        regexp: /<a href="([^"]*?)"[^>]*?>([\s\S]*?)<\/a>/gim,
        replacement: "[link name=$2]$1[/link]"
    },
    {
        name: "Legacy anchor tags",
        regexp: /<a name="(.*?)"><\/a>/gim,
        replacement: "[anchor]$1[/anchor]"
    },
    {
        name: "Float tags",
        regexp: /<div style="float:\s?(.*?)">([\s\S]*?)<\/div><!-- float:\1 -->/gm,
        replacement: "[float=$1]$2[/float]"
    },
    {
        name: "Div open tags",
        regexp: /<div align=(.*?)>/gim,
        replacement: "[div align=$1]"
    },
    {
        name: "Div closing tags",
        regexp: /<\/div>/gim,
        replacement: "[/div]"
    },
    {
        name: "Gametrailers video tag",
        regexp: /<object.*?id="gtembed".*?>[\s\S]*?http:\/\/www.gametrailers.com\/remote_wrap.php\?mid=(\d+)[\s\S]*?<\/object>/gm,
        replacement: "[gametrailers]$1[/gametrailers]"
    },
    {
        name: "Gametrailers user video tag",
        regexp: /<object.*?id="gtembed".*?>[\s\S]*?http:\/\/www.gametrailers.com\/remote_wrap.php\?umid=(\d+)[\s\S]*?<\/object>/gm,
        replacement: "[gametrailers_uservideo]$1[/gametrailers_uservideo]"
    },
    {
        name: "Gamevideos tag",
        regexp: /<object.*?id="gamevideos6".*?>[\s\S]*?http:\/\/www.gamevideos.com\:80\/swf\/gamevideos11.swf\?embedded=1&fullscreen=1&autoplay=0&src=http:\/\/www.gamevideos.com:80\/video\/videoListXML%3Fid%3D(\d+)%26ordinal%3D1176581224863%26adPlay%3Dfalse[\s\S]*?<\/object>/gm,
        replacement: "[gamevideos]$1[/gamevideos]"
    },
    {
        name: "IGN video",
        regexp: /<embed[^>]*?flashvars='([^']*?ign.com[^']*?)&allownetworking.*?'><\/embed>/gm,
        replacement: "[ignvideo]$1[/ignvideo]"
    },
    {
        name: "Neo videos",
        regexp: /<object.*?width="470".*?>\r?\n?<param name="movie" value="http:\/\/videos.neoseeker.com\/v\/(.*?)" \/>[\s\S]*?<\/object>/gim,
        replacement: "[neovid]$1[/neovid]"
    },
    {
        name: "Neo videos with custom size",
        regexp: /<object.*?width="(\d+)".*?>\r?\n?<param name="movie" value="http:\/\/videos.neoseeker.com\/v\/(.*?)" \/>[\s\S]*?<\/object>/gim,
        replacement: "[neovid size=$1]$2[/neovid]"
    },
    {
        regexp: /<embed id="mymovie".*?flashvars=".*?paramsURI=[^"]*?id%3D(\d+)[^"]*?".*?>/gm,
        replacement: "[gamespot]$1[/gamespot]"
    },
    {
        name: "Horizontal rule",
        regexp: /<hr \/>/gm,
        replacement: "[hr]"
    },
    {
        name: "HTML entity cleanup",
        regexp: /\&lt;/gm,
        replacement: "<"
    },
    {
        name: "HTML entity cleanup (2)",
        regexp: /\&gt;/gm,
        replacement: ">"
    },
    {
        name: "HTML entity cleanup (3)",
        regexp: /\&amp;/gm,
        replacement: "&"
    },
    {
        name: "Trim string",
        regexp: /^\s+|\s+$/gm,
        replacement: ""
    }
];
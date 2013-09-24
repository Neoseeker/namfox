///--------------------------------------------------------------------
/// <file name="HtmlToMarkupTranslator.js">
///   Provides functionality to convert from HTML to nTags markup.
/// </file>
///--------------------------------------------------------------------

var HtmlToMarkupTranslator = {
    _literalTranslationTags: ['b', 'i', 'u', 'sup', 'sub', 'pre'],
    _smileyMap: {
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
    },

    _replaceHtmlEntities: function(html) {
        /// <summary>
        ///   Replaces the HTML entities that could be in an HTML string.
        /// </summary>
        /// <param name="html" type="String">The HTML to convert.</param>
        /// <returns type="String" />

        return html.replace(/\&lt;/gi, "<").replace(/\&gt;/gi, ">").replace(/\&amp;/gi, "&");
    },

    _replaceList: function(hierarchy, startingIndex, depth, markup, lastTags) {
        /// <summary>
        ///   Converts a single wikilist to the appropriate markup.
        /// </summary>
        /// <param name="hierarchy" type="String">
        ///   The string containing the list tags to translate.
        /// </param>
        /// <param name="startingIndex" type="Number" integer="true">
        ///   The index in the string that represents at what
        ///   index the scanner is currently set.
        /// </param>
        /// <param name="depth" type="Number" integer="true">
        ///   The depth in the list the scanner is currently at.
        /// </param>
        /// <param name="markup" type="String">
        ///   The new markup string to return.
        /// </param>
        /// <param name="lastTags" type="Array">
        ///   An array of strings (either '#' or '*') that keeps track of
        ///   what element exists on what depth level.
        /// </param>
        /// <returns type="String" />

        var tag = hierarchy.substr(startingIndex, 4);

        if (tag.indexOf("ul") !== -1) {
            markup += HtmlToMarkupTranslator.Util.repeat("*", depth);
            lastTags[depth - 1]  = "*";
        }
        else if (tag.indexOf("ol") !== -1) {
            markup += HtmlToMarkupTranslator.Util.repeat("#", depth);
            lastTags[depth - 1] = "#";
        }
        else if (tag.indexOf("li") !== -1) {
            markup += HtmlToMarkupTranslator.Util.repeat(lastTags[depth - 1], depth);
            startingIndex++;
        }

        markup += " ";

        // Increment by 9: "<ul><li> " or "/li><li> "
        startingIndex += 9;

        var liNextStep = hierarchy.indexOf("</li>", startingIndex);
        if (liNextStep === -1) {
            liNextStep = 1000000;
        }

        var ulNextStep = hierarchy.indexOf("<ul>", startingIndex);
        if (ulNextStep === -1) {
            ulNextStep = 1000000;
        }

        var olNextStep = hierarchy.indexOf("<ol>", startingIndex);
        if (olNextStep === -1) {
            olNextStep = 1000000;
        }

        var nextStep = -1;
        if (liNextStep < ulNextStep) {
            if (liNextStep < olNextStep) {
                nextStep = liNextStep;
            }
            else {
                nextStep = olNextStep;
            }
        }
        else {
            if (ulNextStep < olNextStep) {
                nextStep = ulNextStep;
            }
            else {
                nextStep = olNextStep;
            }
        }

        markup += hierarchy.substr(startingIndex, nextStep - startingIndex);
        startingIndex = nextStep;

        var nextTag = hierarchy.substr(startingIndex, 4);

        if (nextTag.indexOf("/li") !== -1) {
            while (
                (nextTag = hierarchy.substr(startingIndex, 4)) !== ""
                && nextTag.indexOf("<li>") === -1
            ) {
                startingIndex += 5;
                if (nextTag.match(/[ou]l/)) {
                    lastTags[depth - 1] = "";
                    --depth;
                }
            }
            if (nextTag === "") {
                // reached end of the string.
                return markup;
            } else {
                // Reached <li> tag
                return this._replaceList(hierarchy, startingIndex - 5, depth, markup + "\n", lastTags);
            }
        }
        else {
            // Another open tag, redo our analysis.
            return this._replaceList(hierarchy, startingIndex, ++depth, markup + "\n", lastTags);
        }
    },

    _replaceLink: function(href) {
        /// <summary>
        ///   Translates an href found in HTML back into its markup representation,
        ///   taking into account special handling for internal links.
        /// </summary>
        /// <param name="href" type="String">
        ///   The href to translate.
        /// </param>
        /// <returns type="String" />

        if (HtmlToMarkupTranslator.Util.startsWith(href, "http")) {
            return href;
        }

        return "http://www.neoseeker.com" + href;
    },

    _replaceLists: function(html) {
        /// <summary>
        ///   Converts the new wiki-lists into their nTag equivalents.
        /// </summary>
        /// <param name="html" type="String">
        ///   The HTML in which to find and replace wikilists.
        /// </param>
        /// <returns type="String" />

        var listExpr = /(?:<span class="wikilists">)?<[ou]l>(?:<font size="\d">)*<li>(?=.*<\/?(?:[ou]l|li)).*(?:<\/span><\!-- wikilists -->)?/i;
        for (var results = html.match(listExpr); results; results = html.match(listExpr)) {
            var hierarchy = results[0].replace(/(?:<p>|\n)/g, "");
            var filteredHierarchy = hierarchy.replace(/<span class="wikilists">/g, "").replace(/<\/span><\!-- wikilists -->/g, "");

            // In Firefox 3, sometimes the DOM model can become bloated with excess tags that actually appear
            // between the <[ou]l> and <li> or between the </li> and </[ou]l>. This replacement switches the
            // content to a form that interpretList() can account for.
            filteredHierarchy = filteredHierarchy.replace(/<([ou])l>(.*?)<li> /g, "<$1l><li> $2");
            filteredHierarchy = filteredHierarchy.replace(/<\/li>(.*?)<(li|\/[ou]l)>/g, "$1</li><$2>");

            // Sometimes we also see legacy tags that don't insert a trailing </li> tag. This normalization will
            // work in these cases.
            filteredHierarchy = filteredHierarchy.replace(/<li>([^><]*?)(<\/[ou]l>)/g, "<li>$1</li>$2");

            var list = this._replaceList(filteredHierarchy, 0, 1, "", []);
            html = html.replace(new RegExp(hierarchy.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g, "\\$1"), "g"), list);
        }

        return html;
    },

    _replaceSmileys: function(html) {
        /// <summary>
        ///   Replaces smileys with their respective shortcut equivalents in text.
        /// </summary>
        /// <param name="html" type="String">
        ///   The HTML string that should be replaced.
        /// </param>

        var smileyExpr = /<img src="http:\/\/(?:i|www)\.neoseeker\.com\/[di]\/icons\/(.*?)\.(?:gif|png)".*?vspace.*?>/gi;
        var that = this;
        return html.replace(
            smileyExpr,
            function (all, smileyFileName) {
                var smiley = that._smileyMap[smileyFileName];
                return smiley || "";
            }
        );
    },

    _stripPhpFontTags: function(html) {
        /// <summary>
        ///   Strips the font tags that result from PHP's highlight_string() function when converting
        ///   [php] tag content into markup.
        /// </summary>
        /// <param name="html" type="String">The HTML to convert.</param>
        /// <returns type="String" />

        // Needs to run through this regexp multiple times
        // (should only be two though) because there is one font tag that
        // usually stays at the beginning and encompasses
        // the entire php code section.
        var regexp = /<font color=".*?">([\s\S]*?)<\/font>/gi;
        var i = 0;
        while (regexp.test(html)) {
            html = html.replace(regexp, '$1');
        }

        var phpSectionRegexp = /<code>([\s\S]*?)<\/code>/gi;
        var php5Regexp = /<span style=".*?">([\s\S]*?)<\/span>/gi;

        // Use a temporary variable to make the replacements, because
        // phpSectionRegexp's lastIndex should be preserved against the
        // original string so that multiple PHP tags can be found. This
        // is actually what caused Issue #111.
        var newHtml = html;
        while (results = phpSectionRegexp.exec(html)) {
            var phpSection = results[1];

            // Translate twice to account for nested tags.
            var newPhpSection = phpSection.replace(php5Regexp, "$1");
            newPhpSection = newPhpSection.replace(php5Regexp, "$1");

            newHtml = newHtml.replace(HtmlToMarkupTranslator.Util.toRegExp(phpSection, "gi"), newPhpSection);
        }

        return newHtml;
    },

    translate: function(html, callback) {
        /// <summary>
        /// Translates an HTML string directly from Neoseeker into its
        /// appropriate nTag representation.
        /// </summary>
        /// <param name="html" type="String">The HTML to translate.</param>
        /// <param name="callback" type="Function">The callback function to invoke
        /// once the markup has been translated.</param>

        // Strip any "under moderation" tags (since the person
        // who sees these will be a moderator).
        html = html.replace(/<p> \[ Check <a href=".*?\/index.php\?fn=moderation_queue\&amp;f=\d+">moderation queue<\/a> to see who reported this post \] (?:<\/p>)?\s*$/, "");

        // Strip any edit tags from the end of the post.
        html = html.replace(/<div[^>]*?class="text-small right"[^>]*?>[^<]*?Edit[^<]*?<\/div><br \/><\/div>$/, "");

        var postHtml = html.replace(/<p> \[ This message has been moved to the <a href=".*?\/index.php\?fn=moderation_queue\&amp;f=\d+">moderation queue<\/a> and is being shown to you due to your moderator status \] <\/p>\s*$/, "");

        // Used to replace lone <p> tags at the beginning of a post. When
        // the very first part of the post contains a quote, then the <p> tag
        // is *usually* closed at that point. If it is and it contains any text
        // whatsoever (not just tags), then it is preserved. Otherwise, the
        // <p> tags are tossed. There is a particular case here
        // (http://neoseeker.com/forums/index.php?fn=view_thread&t=734010&p=29#446)
        // that exemplifies the second case. There the format is
        // <p><font size="1"></font></p>, so that needs to be tossed.
        //
        // Conversely, here (http://neoseeker.com/forums/index.php?fn=view_thread&t=734010&p=29#450),
        // a post begins with text and then a quote, so we must preserve that <p>.
        // The following two regex expressions are very similar. The only
        // difference is that the first has a plus instead of a star mid-way
        // through. This checks for whether there is any character between HTML tags,
        // because this will mean that text does exist. So if that initial test
        // fails (the if statement) then we replace the initial paragraph tag.
        // Furthermore, we use \A instead of ^ for matching the start of the string.
        // The regex engine will not look past this point if there is no match,
        // which is not the case with ^.
        var replaceExpr = /\A\n<br>\n<p>.*?>.+?<.*?<\/p>(?=<blockquote)/;

        if (!replaceExpr.test(postHtml)) {
            postHtml = postHtml.replace(/\A\n<br>\n<p>.*?<\/p>(?=<blockquote)/, "");
        }

        // Strips extra new lines
        replaceExpr = /(?:<p>)?(?:<br>)*(?=<\/p>(?:\n|<\/div>))/;
        postHtml = postHtml.replace(replaceExpr, "");

        // Getting rid of mail links.
        postHtml = postHtml.replace(/<a href="mailto:(.*?)" target="_blank">\1<\/a>/g, "$1");

        // Odd pattern occurs in posts like this: (See second instance of "GTA Fansites" in HTML)
        // http://www.neoseeker.com/forums/32198/t892328-grand-theft-auto-iv-information-thread/
        postHtml = postHtml.replace(/<\/span>(<font.*?>)?(<br>)+\n\n/g, '</span>$1$2');

        // Initial analysis on how HTML will convert to markup:
        //  1. <blockquote style='color: #222266'><font size=1>quote</font><div class='qt'>x</div></blockquote>
        //     should be converted to [quote]x[/quote]
        //  2. <blockquote style='color: #222266'><font size=1>quote <b>y</b><br /></font><div class='qt'>x</div></blockquote>
        //     should be converted to [quote=y]x[/quote]
        //  3. <table width='90%'><tr><td><font size=1>code</font></td></tr><tr><td class='code'><pre>x</pre></td></tr></table>
        //     should be converted to [code]x[/code].
        //  4. <table width='90%'><tr><td><font size=1>php code</font></td></tr><tr><td class='code'><pre><code>x</code></pre></td></tr></table>
        //      should be converted to [php]x[/php].
        //  5. <br /> needs to be translated to \n
        //  6. <strong> should be converted to [b]. Also, </strong> should be converted to [/b].
        //  7. <em> should be converted to [i]. Also, </em> should be converted to [/i].
        //  8. <del> should be converted to [strike]. Also, </del> should be converted to [/strike].
        //  9. <h1></h1> should be converted to '!'. The number in the heading tag (e.g. 1) determines how many exclamation marks there are.
        //  10. <a href="#____">____</a> should be converted to [[#$1|$2]] for anchor links.
        //  11. <a name="__" id="\1"></a> should be converted to [[$1]] for anchors.
        //  12. Replace <a href="/members/profiles/???" target="_blank">???</a> with [[member:???]]
        //  13. Replace <a href="/forums/index.php?fn=send_pm&amp;manual_username=???" target="_blank">???</a>
        //      with [[pm:$1]]. Additional query string parameters like title and message.
        //  14. Replace <div class="spoiler_header"><b>Spoiler:</b> <span class="spoilertitle">???</span></div><div class="spoiler"><div>
        //      <span class="tip">Highlight this box with your cursor to read the spoiler text.</span><hr>????</div></div> with [spoiler=$1]$2[/spoiler]
        //  14a. New spoiler tags in 0.9.3.
        //  15. <u> should be converted to [u]. Also, </u> should be converted to [/u].
        //  16. <pre> should be converted to [pre]. Also, </pre> should be converted to [/pre].
        //  17. <sup> should be converted to [sup]. Also, </sup> should be converted to [/sup].
        //  18. <sub> should be converted to [sub]. Also, </sub> should be converted to [/sub].
        //  19. Replace # with ol indent and * with ul indent. Allow for nested and mixed indents.
        //  20. <li> should be converted to [li].
        //  21. <ul> should be converted to [ul]. Also, </ul> should be converted to [/ul].
        //  22. <ol> should be converted to [ol]. Also, </ol> should be converted to [/ol].
        //  23. Replace <object height="350" width="425"><embed src="http://www.youtube.com/v/????" type="application/x-shockwave-flash" wmode="transparent"
        //      height="350" width="425"></object> with [youtube]????[/youtube]
        //  24. <span style='color: xxx;'> should be converted to [color=xxx]. Also, </span> in this case should match [/color].
        //     UNDONE: The style attribute here may include more markup text when combined with other tags, so be on the look out for this case.
        //  25. <font size='x'> should be converted to [size='x']. Also, </font> should match [/size].
        //  26. <a href='x' target='_blank'><img src='y' border='1'></a> should be converted to [img link=x]y[/img].
        //      If x contains color (#24) or other formatting tags (#6 - #7), then parse those to their respective markup.
        //  27. <a href="http://dev.neoseeker.com/images_server/v_vfaq_image.php?id=___" style=""><img src="___"></a> should be converted to
        //      [faqimg=$1]$2[/faqimg]
        //  28. <img src='x'> should be converted to [img]x[/img].
        //  29a. <a href="*/members/____/" class="mention">_____</a> should be converted to @____ if the user name has spaces; otherwise, @___@
        //  29b. <a href='x' target='_blank'>y</a> should be converted to [link name=y]x[/link].
        //  30. <a name='x'></a> should be converted to [anchor]x[/anchor]. (Legacy)
        //  31. <div style="float:???">...</div><!-- float:??? --> should be converted to [float=???][/float] for legacy float tags
        //  31b <div class="ntags-pull-???">...</div><!-- float:??? --> should be converted to [float=???][/float]
        //  32. <div align=x> should be converted to [div align=x]. </div> should be converted to [/div].
        //      X should be stripped of all <font color='xxx'></font> tags first though (but keep the content inside of them).
        //  33 - 38. Handles other embedded flash content (videos).
        //  39. <hr /> should be converted to [hr].

        // Cases 1 - 4 need to be handled first because the complexity of tags
        // can be interpreted later on to be something different from what they are
        // i.e. <font></font> in each case can be turned into [size][/size] by accident.
        postHtml = postHtml.replace(/<blockquote(?: style="color: #222266")?><font size=1>quote <b><a href="\/forums\/directmessage.php\?m=(\d+)" target="_blank">(.*?)<\/a><\/b><br \/><\/font><div class="qt">/g, "[quote=$2|message:$1]");
        postHtml = postHtml.replace(/<blockquote(?: style="color: #222266")?><font size=1>quote <b><a href="(.*?)" target="_blank">(.*?)<\/a><\/b><br \/><\/font><div class="qt">/g, "[quote=$2|$1]");
        postHtml = postHtml.replace(/<blockquote(?: style="color: #222266")?><font size=1>quote <b><a href="(.*?)" target="_blank">(.*?)<\/b><br \/><\/font><div class="qt"><\/a>/g, "[quote][originator=[link name=$2]]$1[/link]");
        postHtml = postHtml.replace(/<blockquote(?: style="color: #222266")?><font size=1>quote <b>(.*?)<\/b><br \/><\/font><div class="qt">/g, "[quote=$1]");
        postHtml = postHtml.replace(/<blockquote(?: style="color: #222266")?><font size=1>quote<\/font><div class="qt">/g, "[quote]");

        postHtml = postHtml.replace(/<\/div><\/blockquote>/g, "[/quote]\n\n");

        // Handles case 3
        replaceExpr = /<table width="90%"><tr><td><font size=1>code<\/font><\/td><\/tr><tr><td.*? class="code"><pre.*?>([\s\S]*?)\n?<\/pre><\/td><\/tr><\/table>(<!-- endcode \d+ -->)?/gi;
        if (replaceExpr.test(postHtml)) {
            replaceExpr.lastIndex = 0;
            postHtml = postHtml.replace(replaceExpr, '[code]$1\n[/code]');
        }
        else {
            postHtml = postHtml.replace(/<table width="90%"><tbody><tr><td><font size="1">code<\/font><\/td><\/tr><tr><td.*? class="code"><pre.*?>([\s\S]*?)\n?<\/pre><\/td><\/tr><\/tbody><\/table>(<!-- endcode \d+ -->)?/gi, '[code]\n$1\n[/code]');
        }

        // Strips the font tags left from PHP's highlight_string() function
        postHtml = this._stripPhpFontTags(postHtml);

        // Handles case 4
        replaceExpr = /<table width="90%"><tr><td><font size=1>php code<\/font><\/td><\/tr><tr><td.*? class="code"><pre.*?><code>\s*([\s\S]*?)\s*<\/code><\/pre><\/td><\/tr><\/table>(<!-- endphpcode \d+ -->)?/gi;
        if (replaceExpr.test(postHtml)) {
            replaceExpr.lastIndex = 0;
            postHtml = postHtml.replace(replaceExpr, '[php]\n$1\n[/php]');
        }
        else {
            postHtml = postHtml.replace(/<table width="90%"><tbody><tr><td><font size="1">php code<\/font><\/td><\/tr><tr><td.*? class="code"><pre.*?><code>\s*([\s\S]*?)\s*<\/code><\/pre><\/td><\/tr><\/tbody><\/table>(<!-- endphpcode \d+ -->)?/gi, '[php]\n$1\n[/php]');
        }

        // Handles case 5
        postHtml = postHtml.replace(/<br(?: \/)?>/gi, '\n');

        // Handles case 9
        replaceExpr = /<h(\d)>([\s\S]*?)<\/h\1>/gi;
        postHtml = postHtml.replace(
            replaceExpr,
            function (all, header, content) {
                return HtmlToMarkupTranslator.Util.repeat("!", parseInt(header)) + content;
            }
        );

        replaceExpr = /<h(\d) class="mw_heading">([\s\S]*?)<!-- mw_heading --><\/h\1>/gi;
        postHtml = postHtml.replace(
            replaceExpr,
            function (all, header, content) {
                var surround = HtmlToMarkupTranslator.Util.repeat("=", parseInt(header));
                return surround + content + surround;
            }
        );

        // Handles case 10
        replaceExpr = /<a href="#(.*?)">([\s\S]*?)<\/a>/gi;
        postHtml = postHtml.replace(replaceExpr, "[[#$1|$2]]");

        // Handles case 11
        replaceExpr = /<a name="(.*?)" id="\1"><\/a>/gi;
        postHtml = postHtml.replace(replaceExpr, "[[#$1]]");

        // Handles case 12
        replaceExpr = /<a href="\/members\/([^/]*?)\/" target="_blank">([^<]*?)<\/a>/gi;

        postHtml = postHtml.replace(
            replaceExpr,
            function (all, member, alias) {
                member = member.replace(/(?:\+|\%20)/g, " ");
                alias = alias.replace(/\%20/g, " ");

                if (member === alias) {
                    return "[[member:" + alias + "]]";
                }
                else {
                    return "[[member:" + member + "|" + alias + "]]";
                }
            }
        );

        // Handles case 13 and variants
        replaceExpr = /<a href="\/forums\/index.php\?fn=send_pm(?:_thread)?\&amp;manual_username=([^"]*?)\&amp;title=([^"]*?)" target="_blank">\1<\/a>/gi;
        postHtml = postHtml.replace(
            replaceExpr,
            function (all, member, title) {
                return "[[pm:" + member.replace(/(?:\+|\%20)/g, " ") + "|subject:" + title.replace(/\%20/g, " ") + "]]";
            }
        );

        replaceExpr = /<a href="\/forums\/index.php\?fn=send_pm(?:_thread)?\&amp;manual_username=([^"]*?)\&amp;title=([^"]*?)" target="_blank">([^<]*?)<\/a>/gi;
        postHtml = postHtml.replace(
            replaceExpr,
            function (all, member, title, alias) {
                return "[[pm:" + member.replace(/(?:\+|\%20)/g, " ") + "|subject:" + title.replace(/\%20/g, " ") + "|" + alias + "]]";
            }
        );

        replaceExpr = /<a href="\/forums\/index.php\?fn=send_pm(?:_thread)?\&amp;manual_username=([^"]*?)" target="_blank">([^<]*?)<\/a>/gi;
        postHtml = postHtml.replace(
            replaceExpr,
            function (all, member, alias) {
                member = member.replace(/(?:\+|\%20)/g, " ");
                alias = alias.replace(/\%20/g, " ");

                if (member === alias) {
                    return "[[pm:" + member + "]]";
                }
                else {
                    return "[[pm:" + member + "|" + alias + "]]";
                }
            }
        );

        // Handles case 14 - all variants of spoiler
        replaceExpr = /<div class="spoiler_header"><b>Spoiler:<\/b> <span class="spoilertitle">(.*?)<\/span><\/div><div class="spoiler"><div><span class="tip">Highlight this box with your cursor to read the spoiler text.<\/span><hr>([\s\S]*?)<\/div><\/div>/gi;
        postHtml = postHtml.replace(replaceExpr, "[spoiler=$1]$2[/spoiler]");

        replaceExpr = /<noscript><div class="spoiler_header"><b>Spoiler:<\/b> <span class="spoilertitle">(.*?)<\/span><\/div><div class="spoiler"><div><span class="tip">Highlight this box with your cursor to read the spoiler text.<\/span><hr \/>([\s\S]*?)<\/div><\/div><\/noscript><script type="text\/javascript">document.writeln\('<div><div class="spoiler_header"><input type="button" class="forum_button" value="(?:Show|Hide) Spoiler" onclick="flipshow\(this.parentNode.parentNode\)" \/> <strong>Spoiler:<\/strong><span class="spoilertitle">.*?<\/span><div class="spoiler" style="display:none"><div class="show_spoiler"><hr \/>[\s\S]*?<\/div><\/div><\/div><\/div>'\);<\/script>(<\/.*?>)?(?:<div><div class="spoiler_header">.*?<input class="forum_button" value="Show Spoiler" onclick="flipshow\(this.parentNode.parentNode\)" type="button"> <strong>Spoiler:<\/strong><span class="spoilertitle">  .*?<\/span>.*?<div class="spoiler" style="display: none;"><div class="show_spoiler"><hr>[\s\S]*?<\/div><\/div><\/div><\/div>)?/g;
        postHtml = postHtml.replace(replaceExpr, "[spoiler=$1]$2[/spoiler]$3");

        replaceExpr = /<noscript><div class="spoiler_header"><b>Spoiler:<\/b> <span class="spoilertitle">(.*?)<\/span><\/div><div class="spoiler"><div><span class="tip">Highlight this box with your cursor to read the spoiler text.<\/span><hr \/>([\s\S]*?)<\/div><\/div><\/noscript><div class="spoiler_header" style="display: none;">.*?<input type="button" name="js_spoiler" class="forum_button" value="(?:Show|Hide) Spoiler" onclick="flipshow\(this\)" \/><strong>Spoiler:<\/strong><span class="spoilertitle">.*?<\/span>.*?<div class="spoiler" style="display:none"><div class="show_spoiler"><hr \/>[\s\S]*?<\/div><\/div><\/div>.*?<script type="text\/javascript">var elements = document.getElementsByName\("js_spoiler"\); find_spoiler_root\(elements\[elements.length - 1\]\).style.display = "block";<\/script>/g;
        postHtml = postHtml.replace(replaceExpr, "[spoiler=$1]$2[/spoiler]");

        // Handles case 6
        postHtml = postHtml.replace(/<strong>/gi, "[b]");
        postHtml = postHtml.replace(/<\/strong>/gi, "[/b]");

        // Handles case 7
        postHtml = postHtml.replace(/<em>/gi, "[i]");
        postHtml = postHtml.replace(/<\/em>/gi, "[/i]");

        // Handles case 8
        postHtml = postHtml.replace(/<del>/gi, "[strike]");
        postHtml = postHtml.replace(/<\/del>/gi, "[/strike]");

        // Handles cases 15 - 18
        for (var i = 0; i < this._literalTranslationTags.length; ++i) {
            replaceExpr = new RegExp('<(/?' + this._literalTranslationTags[i] + ')>', 'g');
            postHtml = postHtml.replace(replaceExpr, '[$1]');
        }

        // Handles case 19
        postHtml = this._replaceLists(postHtml);

        // Handles case 20. Also strips </li> tags from the postHtml OBSOLETE - v. 0.8
        postHtml = postHtml.replace(/<li>/g, "[li]");
        postHtml = postHtml.replace(/<\/li>/g, "");

        // Handles cases 21, 22 (if there are any left).
        postHtml = postHtml.replace(/<([ou])l>/g, "[$1l]");
        postHtml = postHtml.replace(/<\/([ou])l>/g, "[/$1l]");

        // Handles case 23a - New yt translation
        replaceExpr = /<!-- yt --><iframe[^>]*?src="https:\/\/www.youtube.com\/embed\/(.*?)\?wmode=transparent".*?><\/iframe><!-- \/yt -->/g;
        postHtml = postHtml.replace(replaceExpr, "[yt]$1[/yt]");

        // Handles case 23b - New youtube translation
        replaceExpr = /<iframe[^>]*?src="https:\/\/www.youtube.com\/embed\/(.*?)\?wmode=transparent".*?><\/iframe>/g;
        postHtml = postHtml.replace(replaceExpr, "[youtube]$1[/youtube]");

        // Handles case 23c - Legacy youtube translation
        replaceExpr = /<object.*?>.*?value="http:\/\/www.youtube.com\/v\/(.*?)">.*?<\/object>/g;
        postHtml = postHtml.replace(replaceExpr, "[youtube]$1[/youtube]");

        // Handles case 24. JavaScript seems to translate hex codes into the format of style="color: rgb(x, y, z)" so we
        // need to translate those colors into their respective hex code formats. All of the other color types (plain text,
        // such as "red" or "green") should be unaffected.
        replaceExpr = /<span style="color: rgb\((.*?)\);">/gi;

        var that = this;
        postHtml = postHtml.replace(
            replaceExpr,
            function (all, rgb) {
                return "[color=" + that._convertColor(rgb) + "]";
            }
        );

        postHtml = postHtml.replace(/<span style="color:\s*(\S*?);">/g, "[color=$1]");
        postHtml = postHtml.replace(/<\/span>/gi, '[/color]');

        // Handles case 25
        postHtml = postHtml.replace(/<font size="?(.*?)"?>/gi, '[size=$1]');
        postHtml = postHtml.replace(/<\/font>/gi, '[/size]');

        // Preprocess all internal links:
        var that = this;
        postHtml = postHtml.replace(/<a href="(.*?)"/gi,
            function (all, href) {
                return '<a href="' + that._replaceLink(href) + '"';
            });

        // Handles case 26 - Image links need to be handled before images and links to avoid any mixup.
        postHtml = postHtml.replace(/<a href="(.*?)".*?><img src="(.*?)" border="1".*? \/><\/a>/gi, "[img link=$1]$2[/img]");

        postHtml = this._replaceSmileys(postHtml);

        // Handles case 27
        postHtml = postHtml.replace(/<a href="http:\/\/i.neoseeker.com\/v_vfaq_image\.php\?id=(\d+)" class="faqimage"><img src="(.*?)" \/><\/a>/gi, '[faqimg=$1]$2[/faqimg]');

        // Handles case 28
        postHtml = postHtml.replace(/<img.*?src="(.*?)".*?>/gi, '[img]$1[/img]');

        // Handles case 29a
        replaceExpr = /<a href=".*?\/members\/(.*?)\/" class="mention">(.*?)<\/a>/i;

        var results = null;
        while (results = replaceExpr.exec(postHtml)) {
            var userName = results[1].replace(/\+/g, " ");
            if (results[2] !== userName) {
                continue;
            }

            var lastIndex = replaceExpr.lastIndex;

            if (userName.indexOf(" ") !== -1) {
                postHtml = postHtml.replace(replaceExpr, "@$2@");
            }
            else {
                postHtml = postHtml.replace(replaceExpr, "@$2");
            }

            replaceExpr.lastIndex = lastIndex;
        }

        // Handles case 29b
        replaceExpr = /<a href="([^"]*?)" target="_blank"[^>]*?class="wikianchor">(.*?)<\/a>/gi;
        postHtml = postHtml.replace(replaceExpr, '[$1 $2]');

        replaceExpr = /<a href="([^"]*?)"[^>]*?>\1<\/a>/gi;
        postHtml = postHtml.replace(replaceExpr, "$1");

        replaceExpr = /<a href="([^"]*?)"[^>]*?>([\s\S]*?)<\/a>/gi;
        postHtml = postHtml.replace(replaceExpr, '[link name=$2]$1[/link]');

        // Handles case 30 - Legacy anchors
        postHtml = postHtml.replace(/<a name="(.*?)"><\/a>/gi, '[anchor]$1[/anchor]');

        // Handles case 31
        postHtml = postHtml.replace(/<div style="float:\s?(.*?)">([\s\S]*?)<\/div><!-- float:\1 -->/g, "[float=$1]$2[/float]");

        // Handles case 31b
		postHtml = postHtml.replace(/<div class="ntags-pull-(.*?)">([\s\S]*?)<\/div><!-- float:\1 -->/g, "[float=$1]$2[/float]");

        // Handles case 32
        postHtml = postHtml.replace(/<div align=(.*?)>/gi, '[div align=$1]');
        postHtml = postHtml.replace(/<\/div>/gi, '[/div]');

        // Handles case 33 - [gametrailers]
        postHtml = postHtml.replace(/<object.*?id="gtembed".*?>[\s\S]*?http:\/\/www.gametrailers.com\/remote_wrap.php\?mid=(\d+)[\s\S]*?<\/object>/g, '[gametrailers]$1[/gametrailers]');

        // Handles case 34 - [gametrailers_uservideo]
        postHtml = postHtml.replace(/<object.*?id="gtembed".*?>[\s\S]*?http:\/\/www.gametrailers.com\/remote_wrap.php\?umid=(\d+)[\s\S]*?<\/object>/g, '[gametrailers_uservideo]$1[/gametrailers_uservideo]');

        // Handles case 35 - [gamevideos]
        postHtml = postHtml.replace(/<object.*?id="gamevideos6".*?>[\s\S]*?http:\/\/www.gamevideos.com\:80\/swf\/gamevideos11.swf\?embedded=1&fullscreen=1&autoplay=0&src=http:\/\/www.gamevideos.com:80\/video\/videoListXML%3Fid%3D(\d+)%26ordinal%3D1176581224863%26adPlay%3Dfalse[\s\S]*?<\/object>/g, '[gamevideos]$1[/gamevideos]');

        // Handles case 36 - [ignvideo]
        postHtml = postHtml.replace(/<embed[^>]*?flashvars='([^']*?ign.com[^']*?)&allownetworking.*?'><\/embed>/g, '[ignvideo]$1[/ignvideo]');

        // Handles case 37a - [neovid]
        postHtml = postHtml.replace(/<object.*?width="470".*?>\r?\n?<param name="movie" value="http:\/\/videos.neoseeker.com\/v\/(.*?)" \/>[\s\S]*?<\/object>/gi, "[neovid]$1[/neovid]");

        // Handles case 37b - [neovid size=]
        postHtml = postHtml.replace(/<object.*?width="(\d+)".*?>\r?\n?<param name="movie" value="http:\/\/videos.neoseeker.com\/v\/(.*?)" \/>[\s\S]*?<\/object>/gi, "[neovid size=$1]$2[/neovid]");

        // Handles case 38 - [gamespot]
        postHtml = postHtml.replace(/<embed id="mymovie".*?flashvars=".*?paramsURI=[^"]*?id%3D(\d+)[^"]*?".*?>/g, "[gamespot]$1[/gamespot]");

        // Handles case 39
        postHtml = postHtml.replace(/<hr \/>/g, "[hr]");

        // Replaces all adblock links
        postHtml = postHtml.replace(/<a style=".*?" title="Click here to block this object with Adblock Plus".*?><\/a>/g, "");

        // Sometimes an extra <p> or </p> tag can pop up from a short post where there are
        // multiple <p> tags because of a signature, so we strip these.
        postHtml = postHtml.replace(/<\/?p(?: .*)?>/gi, '');
        // Replaces the html entities
        postHtml = this._replaceHtmlEntities(postHtml);

        postHtml = HtmlToMarkupTranslator.Util.trim(postHtml);

        if (callback) {
            callback(postHtml);
        }

        return postHtml;
    }
};

HtmlToMarkupTranslator.Util = {
    toRegExp: function(str, flags) {
        /// <summary>Converts a string into a regular expression (RegExp) object.</summary>
        /// <param name="str" type="String">The String object to convert to a RegExp.</param>
        /// <param name="flags" optional="true">(Optional) Flags to pass to the RegExp constructor.</param>
        /// <returns type="RegExp" />

        return new RegExp(str.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,"\\$1"), flags || "");
    },

    repeat: function(original, count) {
        /// <summary>
        ///   Creates a string by repeating the given string
        ///   a certain number of times.
        /// </summary>
        /// <param name="original" type="String">
        ///   The original string to repeat a certain number of times.
        /// </param>
        /// <param name="count" type="Number" integer="true">
        ///   The number of times the original string will occur in the result string.
        /// </param>
        /// <returns type="String" />

        var retVal = [];
        for (var i = 0; i < count; ++i) {
            retVal.push(original);
        }
        return retVal.join("");
    },

    startsWith: function(str, substring) {
        /// <summary>Determines whether the beginning of this instance matches the specified string.</summary>
        /// <param name="str" type="String">The String object in which to search for the substring.</param>
        /// <param name="substring" type="String">The String object to seek.</param>
        /// <returns type="Boolean" />

        return str.indexOf(substring) === 0;
    },

    trim: function(str) {
        /// <summary>Removes all occurrences of white space characters from the beginning and end of this instance.</summary>
        /// <param name="str" type="String">The String object from which to trim whitespace.</param>
        /// <returns type="String" />

        return str.replace(/^\s+|\s+$/g, "");
    }
};
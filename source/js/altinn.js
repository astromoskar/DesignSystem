/* globals anchors, $, localStorage */
window.altinnInit = function () {
  var bpLarge = 992; var options
  // DESIGN SYSTEM SPECIFIC:
  var ctrlDown = false; var ctrlKey = 17
  // DESIGN SYSTEM SPECIFIC:
  var cmdKey = 91; var aKey = 65
  // DESIGN SYSTEM SPECIFIC:
  var SelectText = function (element) {
    var doc = document; var text = $(element)
    var range, selection
    text.each(function (index, text) {
      if ($(text).is(':visible')) {
        if (doc.body.createTextRange) {
          range = document.body.createTextRange(); range.moveToElementText(text)
          range.select()
        } else if (window.getSelection) {
          selection = window.getSelection(); range = document.createRange()
          range.selectNodeContents(text); selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    })
  }
  // DESIGN SYSTEM SPECIFIC:
  var CustomShortcut = function (e) {
    if (ctrlDown && (e.keyCode === aKey)) {
      e.preventDefault(); e.stopPropagation()
      SelectText('.language-markup code')
    }
  }
  // Toggle elements with the same parent + add 'open'-class ???
  $(function () {
    $('.js-toggle').click(function () {
      var self = $(this)
      if (self.hasClass('open')) {
        self.parent().find('.js-hide').slideUp(300); self.removeClass('open')
      } else {
        self.addClass('open'); self.parent().find('.js-hide').slideDown(300)
      }
      return false
    })
  })
  // Add dim class to panels
  $(function () {
    $('.index-heading').click(function () {
      if ($(this).hasClass('expanded')) {
        $(this).removeClass('expanded')
        if ($('.panel-heading.expanded').length === 0) {
          $('.panel-heading').removeClass('dim')
        } else $(this).addClass('dim')
      } else {
        $('.panel-heading').removeClass('expanded')
        $(this).addClass('expanded'); $('.panel-heading').addClass('dim')
        $('.panel-heading.expanded').removeClass('dim')
      }
    })
  })
  // DESIGN SYSTEM SPECIFIC: Handle theme toggle
  $(function () {
    var toggleStuff = function (className) {
      $('body', $('iframe').contents()[0]).attr('class', className)
      localStorage.setItem('theme', className)
      $('body', '.ap-profile').attr('class', '')
    }
    $('#sg-switchtheme-blue', $('iframe').contents()[0]).off('change')
    $('#sg-switchtheme-grey', $('iframe').contents()[0]).off('change')
    $('#sg-switchtheme-white', $('iframe').contents()[0]).off('change')
    if (localStorage.getItem('theme') &&
      localStorage.getItem('theme') === 'business') {
      $('body', $('iframe').contents()[0]).attr('class', 'business')
      $('#sg-switchtheme-blue', $('iframe').contents()[0]).prop('checked', true)
    } else if (localStorage.getItem('theme') &&
      localStorage.getItem('theme') === 'private-person') {
      $('body', $('iframe').contents()[0]).attr('class', 'private-person')
      $('#sg-switchtheme-grey', $('iframe').contents()[0]).prop('checked', true)
    } else {
      $('body', $('iframe').contents()[0]).attr('class', 'neutral')
      $('#sg-switchtheme-white', $('iframe').contents()[0])
        .prop('checked', true)
    }
    $('#sg-switchtheme-blue', $('iframe').contents()[0]).on('change',
      function () { toggleStuff('business') })
    $('#sg-switchtheme-grey', $('iframe').contents()[0]).on('change',
      function () { toggleStuff('private-person') })
    $('#sg-switchtheme-white', $('iframe').contents()[0]).on('change',
      function () { toggleStuff('neutral') })
    $('body', '.ap-profile').attr('class', '')
  })
  // Handle filter toggle
  $(function () {
    $('.a-collapseTitle').on('mouseup', function () {
      var actionRow = $(this).attr('data-target')
      if (!$(this).hasClass('collapsed')) {
        $(this).addClass('collapsed')
        if ($(this).parent().is('td')) {
          $(actionRow).prev().removeClass('open')
          $(actionRow).css('display', 'none')
        }
      } else {
        $('.a-collapseContent').removeClass('in')
        $('.a-collapseTitle').addClass('collapsed')
        $(this).removeClass('collapsed')
        if ($(this).parent().is('td')) {
          $('.open').next().css('display', 'none')
          $('.open').removeClass('open')
          $(actionRow).css('display', 'table-row')
          $(actionRow).prev().addClass('open')
        }
      }
    })
    $('.a-collapseTitle').on('keyup', function (e) {
      var key = e.which
      if (key === 13) {
        e.stopImmediatePropagation(); e.stopPropagation(); e.preventDefault()
        $(e.target).trigger('mouseup')
      } else if (key === 9) {
        if ($($(e.target).attr('data-target')).hasClass('in')) {
          $($(e.target).attr('data-target')).find('.a-switch').eq(0)
            .trigger('focus')
        }
      }
    })
  })
  // Make all cards in the same group the same height
  $(function () {
    var cardGroup = $('.a-card-group'); var maxheight = 0
    cardGroup.children().each(function () {
      if ($(this).height() > maxheight) maxheight = $(this).height()
    })
    cardGroup.children().children().css('min-height', maxheight)
  })
  // Adjust position of second level menu upon click:
  $(function () {
    $('#colnav').on('mouseup', function (event) {
      var target = $(event.target); var second = $('.a-colnav-secondLevel')
      var getThird = function (el) {
        if (el.attr('class') === '.a-colnav-thirdLevel') return el
        else return el.find('.a-colnav-thirdLevel')
      }
      var findOpenThird = function (el) {
        var bool = false
        el.find('.a-colnav-thirdLevel').each(function () {
          if ($(this).attr('data-ignore') === 'false') bool = true
        })
        return bool
      }
      var isOpen = function (el) {
        var x = 'expanded'
        return (el.closest('a').hasClass(x) || el.find('a').hasClass(x) ||
          el.hasClass(x))
      }
      var ul = target.closest('ul')
      if (ul.hasClass('a-colnav')) second.css('margin-left', '-1px')
      if (ul.hasClass('a-colnav-secondLevel' || 'a-colnav-thirdLevel')) {
        if (!findOpenThird(ul)) {
          if ($(window).width() >= bpLarge) {
            second.animate({ 'margin-left': '-78px' }, 125)
          }
        } else {
          if ($(window).width() >= bpLarge) second.css('margin-left', '-78px')
        }
        getThird(ul).css('margin-left', '-1px').css('left', '100%')
          .attr('data-ignore', 'false')
        if (ul.hasClass('a-colnav-secondLevel') &&
          $(window).width() >= bpLarge) {
          ul.children('li').children('a').addClass('dim-second')
          target.closest('a').removeClass('dim-second')
          target.children('a').removeClass('dim-second')
          target.removeClass('dim-second')
        }
      } else if (ul.hasClass('a-colnav') && isOpen(target)) {
        $('#a-js-suggestionList').css('display', 'block')
        $('.dim').removeClass('dim'); second.css('margin-left', '-10000px')
        getThird(ul).css('margin-left', '-10000px').attr('data-ignore', 'true')
        $('.col-md-3').removeClass('col-md-3').addClass('col-md-6')
          .removeClass('col-md-offset-4').addClass('col-md-offset-1')
      } else {
        second.each(function () {
          getThird($(this)).attr('data-ignore', 'true')
        })
        $('#a-js-suggestionList').css('display', 'none')
        $('.dim-second').removeClass('dim-second')
        $('.col-md-6').removeClass('col-md-6').addClass('col-md-3')
          .removeClass('col-md-offset-1').addClass('col-md-offset-4')
      }
    })
  })
  // If state on input is 'focus', add class to a-input: 'a-input-focus'
  $(function () {
    $('input.form-control').focus(function () {
      $(this).parent().addClass('a-input-focus')
    }).blur(function () { $(this).parent().removeClass('a-input-focus') })
  })
  // Tooltip and popovers ???
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
    $('[data-toggle="popover"]').popover(); $('#example').popover(options)
  })
  // Collapse 'Mobile navigation' + add 'open'-class
  $(function () {
    $('.ap-sideNav-mobilebar').click(function () {
      var self = $(this)
      var searchButton = $('.a-toggle-search').hasClass('open')
      if (self.hasClass('open')) {
        $('.ap-sideNav-collapse').slideUp(300); self.removeClass('open')
      } else {
        if (searchButton === true) {
          $('.a-search').slideUp(300); $('.a-toggle-search').removeClass('open')
        }
        self.addClass('open'); $('.ap-sideNav-collapse').slideDown(300)
      }
      return false
    })
  })
  // Add dim class to colnav first level (the panels that are not active)
  $(function () {
    $('.a-colnav-item').click(function () {
      $(this).parent().find('.a-colnav-item-second').eq(0).focus()
      if ($(this).hasClass('expanded') && $(window).width() >= bpLarge) {
        $(this).removeClass('expanded')
        if ($('.a-colnav-item.expanded').length === 0) {
          $('.a-colnav-item').removeClass('dim-second-no')
        } else $(this).addClass('dim')
      } else if ($(window).width() >= bpLarge) {
        $('.a-colnav-item').removeClass('expanded')
        $(this).addClass('expanded'); $('.a-colnav-item').addClass('dim')
        $('.a-colnav-item.expanded').removeClass('dim')
      }
    })
  })
  // Add dim class to colnav second level
  $(function () {
    $('.a-colnav-item-second').click(function () {
      $(this).parent().find('.a-colnav-item-third').eq(0).focus()
      if ($(this).hasClass('expanded-second') && $(window).width() >= bpLarge) {
        $(this).removeClass('expanded-second')
        if ($('.a-colnav-item-second.expanded-second').length === 0) {
          $('.a-colnav-item-second').removeClass('dim-second-no')
        } else $(this).addClass('dim-second')
      } else if ($(window).width() >= bpLarge) {
        $('.a-colnav-item-second').removeClass('expanded-second')
        $(this).addClass('expanded-second')
        $('.a-colnav-item-second').addClass('dim-second')
        $('.a-colnav-item-second.expanded-second').removeClass('dim-second')
      }
    })
  })
  // Repair drilldown navigation (keyboard/screen reader)
  $(function () {
    $('.a-colnav-item').attr('tabindex', '0')
    $('.a-colnav-item-second').attr('tabindex', '0')
    $('.a-colnav-item-third').attr('tabindex', '0')
    $('.a-colnav-item').on('focus', function () {
      if ($('.a-colnav-secondLevel.submenu.is-active').length === 1) {
        $(this).off('keydown.zf.drilldown')
        $(this).parent().find('.a-colnav-item-second').eq(0).focus()
      }
    })
  })
  // Proxy content propagator, for inclusion of content in more than one place
  $(function () {
    $('.propagated-content-destination').each(function () {
      var prefix = '.propagated-content-origin.'
      if ($(this).hasClass('replace-me')) {
        $(this).before($(prefix + $(this).attr('data-refclass')).html())
        $(this).remove()
      } else $(this).html($(prefix + $(this).attr('data-refclass')).html())
    })
  })
  // DESIGN SYSTEM SPECIFIC: Add anchors to all h1s, h2s, h3s and h4s inside of .ap-content
  anchors.options.placement = 'left'; anchors.options.class = 'a-anchor'
  anchors.add('.ap-content h1, .ap-content h2, .ap-content h3, .ap-content h4')
  // DESIGN SYSTEM SPECIFIC: Select all within code box
  $(document).keydown(function (e) {
    if (e.keyCode === ctrlKey || e.keyCode === cmdKey) ctrlDown = true
  }).keyup(function (e) {
    if (e.keyCode === ctrlKey || e.keyCode === cmdKey) ctrlDown = false
  })
  $('body').on('click', '.sg-pattern-extra-toggle', function () {
    setTimeout(function () {
      $('.language-markup').off('keydown', CustomShortcut).attr('tabindex', '1')
        .on('keydown', CustomShortcut)
    }, 500)
  })
  // DESIGN SYSTEM SPECIFIC: Inset variation elements
  $(function () {
    $('.sg-pattern').each(function () {
      if ($(this).attr('id').indexOf('♺') !== -1) {
        $(this).addClass('a-sg-patternVariations')
      }
    })
  })
  // Functionality for questionnaire
  $(function () {
    $('.a-trigger-question').each(function () {
      $(this).find('input').on('change', function () {
        $(this).parent().parent().parent().next().show()
      })
    })
  })
  // Prevent focus state styling on click
  $(function () {
    $('body').on('mousedown', '*', function () {
      var me = $(this)
      me.addClass('override-focus')
      setTimeout(function () {
        me.removeClass('override-focus')
      }, 1500)
      me.children('.c-indicator').addClass('override-focus')
      setTimeout(function () {
        me.children('.c-indicator').removeClass('override-focus')
      }, 1500)
    })
  })
}
window.altinnInit()
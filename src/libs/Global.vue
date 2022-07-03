<template>
  <div>
  </div>
</template>
<script>
import { mapFields } from "vuex-map-fields"
import axios from "axios"

export default {
  data() {
    return {
      filter: {
        start: null,
        end: null,
      },
      selectedDate: []
    }
  },
  computed: {
    ...mapFields([
      "apiUrl",
      "baseUrl"
    ]),
  },
  methods: {
    strToSlug(slug) {
      slug = slug.replace(/^\s+|\s+$/g, '');
      slug = slug.toLowerCase();

      const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
      const to = 'aaaaeeeeiiiioooouuuunc------';

      for (let i = 0, l = from.length; i < l; i++) {
        slug = slug.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
      }

      slug = slug
        .normalize('NFD')
        .replace(/[^a-z0-9 -]^[\u4e00-\u9fa5]/g, '') // remove all that not are a letter, a number, and are not a chinese word
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace('-?', '') 
        .replace('?', '');

      return slug;
    },
    
    async WebpIsSupported() {
      // If the browser doesn't has the method createImageBitmap, you can't display webp format
      if (!self.createImageBitmap) return false;
    
      // Base64 representation of a white point image
      const webpData = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';
      
      // Retrieve the Image in Blob Format
      const blob = await fetch(webpData).then(r => r.blob());

      // If the createImageBitmap method succeeds, return true, otherwise false
      return createImageBitmap(blob).then(() => true, () => false);
    },

    // check_webp_feature:
    //   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
    //   'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)
    check_webp_feature(feature, callback) {
      var kTestImages = {
          lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
          lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
          alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
          animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
      };
      var img = new Image();
      img.onload = function () {
          var result = (img.width > 0) && (img.height > 0);
          callback(feature, result);
      };
      img.onerror = function () {
        callback(feature, false);
      };
      img.src = "data:image/webp;base64," + kTestImages[feature];
    },

    uploader(filename) {
      if (!filename) {
        return this.apiUrl + '/img/noimage.png'
      }
      return this.apiUrl + '/uploader/' + filename
    },
    doFilter(cb = false, isquery = true) {
      const data = Object.keys(this.filter)
        .filter((k) => this.filter[k] !== null)
        .reduce((a, k) => ({ ...a, [k]: this.filter[k]}), {})

      if(data.page == 1) {
        delete data.page
        
        if(isquery) {
          this.$router
          .push({
            name: this.$route.name,
            query: {
              ...data
            },
            params: {
              ...this.$route.params,
              savePosition: true,
            }
          })
          .catch(() => {})
        } else {
          this.$router
          .push({
            name: this.$route.name,
            params: {
              ...this.$route.params,
              savePosition: true,
            }
          })
          .catch(() => {})
        }
      }

      if(isquery) {
        this.$router
        .push({
          name: this.$route.name,
          query: {
            ...data
          },
          params: {
            ...this.$route.params,
            savePosition: true,
          }
        })
        .catch(() => {})
      } else {
        this.$router
        .push({
          name: this.$route.name,
          params: {
            ...this.$route.params,
            savePosition: true,
          }
        })
        .catch(() => {})
      }

      if (cb) {
        return cb(data)
      }
    },
    kFormatter(num) {
      return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
    },

    async downloadImage(url) {
      var base64 = await axios
        .get(url, {
          responseType: "arraybuffer"
        })
        .then(response =>
          Buffer.from(response.data, "binary").toString("base64")
        );
      var img = new Image();
      img.src = "data:image/jpeg;base64, " + base64;
      return img;
    },
    formatDate(date) {
      if (!date) {
        return;
      }

      if (date instanceof Date) {
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      }

      if ((date.toString() || '').indexOf('/') !== -1) {
        // unslashed date
        let usd = date.split('/');
        
        let formatted = new Date(usd[2], parseInt(usd[0]) - 1, usd[1]);

        return formatted.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      }

      const isParsed = (date || '').indexOf('T') !== -1;

      // kalo formatnya 2022-01-01 15:00:00 di ubah jadi 2022-01-01T15:00:00
      const d = !isParsed ? date.replace(/ /g, 'T') : date;

      return new Date(d).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    formatDateShort(date) {
      if (!date) {
        return;
      }

      if (date instanceof Date) {
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      }

      if ((date.toString() || '').indexOf('/') !== -1) {
        // unslashed date
        let usd = date.split('/');
        
        let formatted = new Date(usd[2], parseInt(usd[0]) - 1, usd[1]);

        return formatted.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      }

      const isParsed = (date || '').indexOf('T') !== -1;

      const d = !isParsed ? date.replace(/ /g, 'T') : date;

      return new Date(d).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    formatDateWithoutWeekday(date) {
      if (!date) {
        return;
      }

      if (date instanceof Date) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }

      if ((date.toString() || '').indexOf('/') !== -1) {
        // unslashed date
        let usd = date.split('/');
        
        let formatted = new Date(usd[2], parseInt(usd[0]) - 1, usd[1]);

        return formatted.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }

      const isParsed = (date || '').indexOf('T') !== -1;

      const d = !isParsed ? date.replace(/ /g, 'T') : date;

      return new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    formatDateNumeric(date) {
      if (!date) {
        return;
      }

      if (date instanceof Date) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
      }

      if ((date.toString() || '').indexOf('/') !== -1) {
        // unslashed date
        let usd = date.split('/');
        
        let formatted = new Date(usd[2], parseInt(usd[0]) - 1, usd[1]);

        return formatted.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
      }

      const isParsed = (date || '').indexOf('T') !== -1;

      const d = !isParsed ? date.replace(/ /g, 'T') : date;

      return new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      })
    },
    formatDateWithHour(date) {
      if (!date) {
        return;
      }

      if (date instanceof Date) {
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })
      }

      if ((date.toString() || '').indexOf('/') !== -1) {
        // unslashed date
        let usd = date.split('/');
        
        let formatted = new Date(usd[2], parseInt(usd[0]) - 1, usd[1]);

        return formatted.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })
      }

      const isParsed = (date || '').indexOf('T') !== -1;

      const d = !isParsed ? date.replace(/ /g, 'T') : date;

      return new Date(d).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
    },
    numFormatter(num) {
      return Math.abs(Number(num)) >= 1.0e+9

      ? Math.abs(Number(num)) / 1.0e+9 + "B"
      
      : Math.abs(Number(num)) >= 1.0e+6

      ? Math.abs(Number(num)) / 1.0e+6 + "M"

      : Math.abs(Number(num)) >= 1.0e+3

      ? Math.abs(Number(num)) / 1.0e+3 + "K"

      : Math.abs(Number(num));
    },
    getDateDay(dayDate){
      const d = new Date(dayDate)

      const weekday = new Array(7)
      weekday[0] = "Sunday"
      weekday[1] = "Monday"
      weekday[2] = "Tuesday"
      weekday[3] = "Wednesday"
      weekday[4] = "Thursday"
      weekday[5] = "Friday"
      weekday[6] = "Saturday"

      let day = weekday[d.getDay()]
      return day
    },
    humanize(str) {
      var i, frags = str.split('_');
      for (i=0; i<frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
      }
      return frags.join(' ');
    },

    isMobileAndTablet() {
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },

    isOnlyTablet() {
      if(/iPad/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },

    isOnlyMobile() {
      if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log("mobile")
        return true
      } else {
        return false
      }
    },

    formatRupiah(e) {
	
      let	number_string = (e || {}).toString(),
        sisa 	= number_string.length % 3,
        rupiah 	= number_string.substr(0, sisa),
        ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
          
      if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
      }

      return rupiah
    }
  }
}
</script>
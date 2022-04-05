<template>
  <div>
    <div v-if="status === 'qualificationStart'" style="padding: 1em">
      <h2 class="md-display-1">
        {{ experimentAttr.text.sections.qualificationStart.header }}
      </h2>

      <p>
        {{ experimentAttr.text.sections.qualificationStart.blurb }}
      </p>

      <form v-on:submit.prevent="startSurvey">
        <md-button
          @click="startQualification"
          class="md-raised md-primary"
          style="margin-left: 1em"
        >
          Begin
        </md-button>
      </form>
    </div>

    <div
      v-if="status === 'start'"
      style="padding: 1em; position:fixed; width: 100%"
    >
      <md-layout
        style="padding: 1em; width:100%; height:100%; text-align:center"
        class="start"
        md-align="center"
        md-column
        md-vertical-align="center"
      >
        <h2 class="md-display-2" style="white-space: pre-wrap">
          {{ experimentAttr.text.sections.start.header }}
        </h2>

        <p style="max-width: 50rem; white-space: pre-wrap">
          {{ experimentAttr.text.sections.start.blurb }}
        </p>

        <div>
          <form v-on:submit.prevent="startSurvey">
            <md-input-container>
              <label>Ålder / Age</label>
              <!-- <md-input v-model="initial"></md-input> -->
              <md-input required v-model.number="age" type="number"></md-input>
            </md-input-container>

            <b>Kön / Gender</b>
            <div>
              <md-radio v-model="gender" md-value="female"
                >Kvinna / Female</md-radio
              >
              <md-radio v-model="gender" md-value="male">Man / Male</md-radio>
              <md-radio v-model="gender" md-value="other"
                >Annat / Other</md-radio
              >
              <md-radio v-model="gender" md-value="notspecified"
                >Vill ej svara / Prefer not to answer</md-radio
              >
            </div>

            <br />
            <b
              >Har du arbetat med bilder eller bildkvalitet? / Have you worked
              with images or image quality?</b
            >
            <div>
              <md-radio v-model="imageExperience" md-value="none"
                >Nej / No</md-radio
              >
              <md-radio v-model="imageExperience" md-value="professional"
                >Ja, professionellt / Yes, professionally</md-radio
              >
              <md-radio v-model="imageExperience" md-value="education"
                >Ja, i min utbildning / Yes, during my education</md-radio
              >
            </div>

            <md-button
              :disabled="
                !(
                  Number.isInteger(age) &&
                  age > 0 &&
                  age < 200 &&
                  gender !== null &&
                  imageExperience !== null
                )
              "
              @click="startSurvey"
              class="md-raised md-primary"
              style="margin-left: 1em; padding:1em 4em"
            >
              Start
            </md-button>
          </form>
        </div>
      </md-layout>
    </div>

    <div v-else-if="status === 'done'" class="done">
      <md-layout
        style="padding: 1em"
        class="md-display-1 done"
        md-align="center"
        md-column
        md-vertical-align="center"
      >
        <h2 class="md-display-2" style="white-space: pre-wrap">
          {{ experimentAttr.text.sections.done.header }}
        </h2>

        <p style="white-space: pre-wrap">
          {{ experimentAttr.text.sections.done.blurb }}
        </p>

        <!-- <md-whiteframe
          style="
            padding: 0.5em;
            text-transform: none;"
        >
          {{ surveyCode }}
        </md-whiteframe> -->
      </md-layout>
    </div>

    <div v-else-if="status === 'qualificationFailed'" class="done">
      <md-layout
        style="padding: 1em"
        class="md-display-1 done"
        md-align="center"
        md-column
        md-vertical-align="center"
      >
        <h2 class="md-display-2" style="white-space: pre-wrap">
          {{ experimentAttr.text.sections.qualificationFailed.header }}
        </h2>

        <p style="white-space: pre-wrap">
          {{ experimentAttr.text.sections.qualificationFailed.blurb }}
        </p>
      </md-layout>
    </div>

    <div v-else-if="status === 'running' || status === 'qualifying'">
      <!-- <md-progress style="height: 8px" :md-progress="progress" /> -->

      <md-layout md-align="center" style="padding: 1em">
        <h2
          class="md-display-1"
          style="text-align: center; white-space: pre-wrap"
        >
          {{ experimentAttr.text.sections.running.header }}
        </h2>

        <div
          style="width: 100%; text-align: center; margin-bottom: 1em; white-space: pre-wrap"
        >
          {{ experimentAttr.text.sections.running.blurb }}
        </div>

        <div v-if="isLoading">
          <md-spinner
            style="margin-top: 3em;"
            :md-size="150"
            md-indeterminate
          />
          <div style="text-align: center">
            Loading...
          </div>
        </div>

        <md-layout
          v-if="!isLoading && question"
          md-align="center"
          md-flex="100"
        >
          <img style="height:300px" :src="question.fullUrl" />
        </md-layout>

        <md-layout
          v-if="!isLoading"
          md-align="center"
          style="flex-direction: row-reverse; flex-wrap: wrap-reverse"
        >
          <div
            v-for="(choice, i) of choices"
            :key="i"
            :style="{ order: i == 0 ? 3 : 1 }"
          >
            <md-whiteframe
              md-elevation="5"
              style="
                margin-left: 1em;
                margin-right: 1em;
                margin-bottom: 1em;"
            >
              <div style="height: 1px;">
                <md-progress v-if="choice.isClick" md-indeterminate />
              </div>

              <integer-scaling-image :scale="1" :img-url="choice.fullUrl" />
              <div
                :style="{
                  width: '100%',
                  paddingTop: '1em',
                  paddingBottom: '1em',
                  textAlign: 'center'
                }"
              >
                <md-button
                  :disabled="isChosen"
                  class="md-raised choice"
                  @click="choose(choice)"
                >
                  Välj / Choose
                </md-button>
              </div>
            </md-whiteframe>
          </div>

          <!-- REF IMAGE -->
          <md-whiteframe
            v-if="refImageExists"
            md-elevation="5"
            style="
              margin-left: 1em;
              margin-right: 1em;
              margin-bottom: 1em;
              order: 10;"
          >
            <integer-scaling-image :scale="1" :imgUrl="referenceImage" />
            <div
              :style="{
                width: '100%',
                paddingTop: '2.2em',
                paddingBottom: '1em',
                textAlign: 'center'
              }"
            >
              <b>Referens / Reference</b>
            </div>
          </md-whiteframe>
        </md-layout>
      </md-layout>
    </div>
  </div>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.done {
  width: 100vw;
  height: 100vh;
  margin-left: -14px;
  background-image: linear-gradient(35deg, #ff5f6d -10%, #ffc371);
  color: white;
  text-transform: uppercase;
  font-weight: lighter;
  text-align: center;
}
.done h1,
.done h2,
.done h3,
.done h4,
.done h5 {
  color: white;
}
</style>

<script>
import _ from 'lodash'
import config from '../config'
import rpc from '../modules/rpc'
import util from '../modules/util'
import IntegerScalingImage from './IntegerScalingImage.vue'

function delay (timeMs) {
  return new Promise(resolve => {
    setTimeout(resolve, timeMs)
  })
}

let loadedImages = {}

function preloadImages (urls) {
  for (let url of urls) {
    if (!(url in loadedImages)) {
      let img = new Image()
      img.src = url
      loadedImages[url] = img
      console.log('> Participant.preloadImage', img.src)
    }
  }
}

function areImagesLoaded (urls) {
  for (let url of urls) {
    if (url in loadedImages) {
      let image = loadedImages[url]
      let isLoaded = image.complete && image.naturalHeight !== 0
      if (!isLoaded) {
        return false
      }
    } else {
      console.log(
        `> Participant.areImagesLoaded warning: ${url} not found in ${_.keys(
          loadedImages
        )}`
      )
      return false
    }
  }
  return true
}

export default {
  name: 'invite',
  components: { IntegerScalingImage },

  data () {
    return {
      status: null,
      surveyCode: null,
      progress: 0,
      question: null,
      choices: [],
      isChosen: false,
      isLoading: true,
      experimentAttr: {},
      referenceImage: null,
      refImageExists: false,
      age: null,
      gender: null,
      imageExperience: null
    }
  },

  mounted () {
    let participateId = this.$route.params.participateId
    rpc.rpcRun('publicGetNextChoice', participateId).then(this.handleResponse)
  },

  methods: {
    async handleResponse (response) {
      let result = response.result
      console.log(
        `> Participant.handleResponse status=${result.status}`,
        _.clone(result)
      )
      this.status = result.status
      this.experimentAttr = result.experimentAttr

      if (this.status === 'start') {
      } else if (this.status === 'done') {
        this.surveyCode = result.surveyCode
      } else if (_.includes(['running', 'qualifying'], this.status)) {
        this.experimentAttr = result.experimentAttr
        this.progress = result.progress
        this.method = result.method

        // clear screen, delay required for page to redraw
        this.question = null
        this.choices.length = 0
        this.isChosen = false
        this.isLoading = true

        await delay(200)

        let waitToLoadUrls = []
        if (result.question) {
          result.question.fullUrl = config.apiUrl + result.question.url
          waitToLoadUrls.push(config.apiUrl + result.question.url)
        }
        for (let choice of result.choices) {
          choice.fullUrl = config.apiUrl + choice.url
          choice.isClick = false
          waitToLoadUrls.push(choice.fullUrl)
        }

        preloadImages(waitToLoadUrls)
        while (!areImagesLoaded(waitToLoadUrls)) {
          await delay(100)
        }

        this.isLoading = false
        this.choices = _.shuffle(result.choices)

        // Get correct reference image to show
        let currentID = util.extractId(this.choices[0].url)
        let refImages = {}

        for (let url of result.refUrls) {
          let img = new Image()
          img.src = url
          refImages[url] = img
        }
        this.refImageExists = false
        for (let image in refImages) {
          if (util.extractId(image) === currentID) {
            this.referenceImage = image
            this.refImageExists = true
          }
        }

        this.referenceImage = config.apiUrl + this.referenceImage

        if (result.question) {
          this.question = result.question
        }

        let repeat = false
        if (this.choices[0].isRepeat) {
          repeat = this.choices[0].isRepeat
        } else if (this.choices[0].comparison) {
          repeat = this.choices[0].comparison.isRepeat
        }

        if (result.urls) {
          preloadImages(_.map(result.urls, u => config.apiUrl + u))
        }

        console.log(
          `> Participant.handleResponse ` +
            `setid=${util.extractId(waitToLoadUrls[0])} ` +
            `repeat=${repeat} ` +
            `urls=${util.jstr(_.map(this.choices, 'url'))}`,
          result.choices
        )
      }
    },

    async choose (choice) {
      choice.isClick = true
      this.isChosen = true
      this.$forceUpdate()
      let participateId = this.$route.params.participateId
      let method = this.method
      let response = await rpc.rpcRun(method, participateId, choice)
      return this.handleResponse(response)
    },

    startSurvey () {
      let participateId = this.$route.params.participateId
      return rpc
        .rpcRun('publicSaveParticipantUserDetails', participateId, {
          isQualified: true,
          age: this.age,
          gender: this.gender,
          imageExperience: this.imageExperience
        })
        .then(this.handleResponse)
    },

    startQualification () {
      let participateId = this.$route.params.participateId
      return rpc
        .rpcRun('publicSaveParticipantUserDetails', participateId, {
          isQualified: false
        })
        .then(this.handleResponse)
    }
  }
}
</script>

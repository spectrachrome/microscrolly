/**
 * Take the JSON representation of a Vue component and convert it to an actual one.
 *
 * @param {string} json - The JSON object which will be deserialized to a Vue component.
 */
export default function deserialize(json) {
  var component = {};
  component.template = json.template;

  if (json.style) {
    // Create a new <style> element from the style string and add it to document header.
    var style = document.createElement("style");
    style.type = "text/css";
    document.getElementsByTagName("head")[0].appendChild(style);

    style.innerHTML = json.style;
  }

  // Parse data() method from function string.
  if (json.data) {
    // NOTE:
    // The assignment expression must ALWAYS be inside the eval() call, or there will be an error!
    eval(`component.data = ${json.data}`);
  }

  if (json.methods) {
    component.methods = {};

    // Evaluate and add each string function.
    for (const [k, v] of Object.entries(json.methods)) {
      eval(`component.methods[k] = ${v}`);
    }
  }

  return component;
}

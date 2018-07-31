#include <node.h>
#include <string>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;
using namespace std;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  string str(*(String::Utf8Value)args[0]);

  unsigned long long steam = stoull(str);

  bool lowest = steam & 1;
  unsigned long steam31 = steam >> 1 & 0x7FFFFFFF;
  uint8_t universe = steam >> 56;

  string output = "STEAM_" + to_string(universe) + ":" + to_string(lowest) + ":" + to_string(steam31);

  args.GetReturnValue().Set(v8::String::NewFromUtf8(isolate, output.c_str()));
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "toSteam2", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}
f = open("glcorearb.h")

cnt = 0

exts = ["ARB", "KHR", "AMD", "NV", "OVR", "APPLE", "EXT", "INTEL", "MESA",
    "VIEW",
    "GL_CONTEXT_ROBUST_ACCESS"
]
def IsExts(line):
    for ext in exts:
        head = "GL_" + ext + "_"
        tail = "_" + ext
        tokens = line.split()
        if tokens[1].endswith(tail) or tokens[1].startswith(head) or tokens[1] == ext:
            return True
    return False

def IsMacro(line):
    tokens = line.split()
    if len(tokens) != 3 or not tokens[2].startswith("0x"):
        return True
    else:
        return False

enum2hex = {}
hex2enum = {}



def find_key(enum):
    for el in hex2enum.values():
        if enum in el:
            return el
    return []


header = """#pragma once
#ifdef __cplusplus
#include <string>
#endif
#include <glad/glad.h>
"""

if __name__ == '__main__':

    for line in f.readlines():
        if line.startswith("#define"):
            tokens = line.split()
            if not IsMacro(line) and not IsExts(line):
                print(line)

                e = tokens[1]
                h = "0x" + tokens[2][2:].lstrip("0")

                if tokens[2] == "0xFFFFFFFFFFFFFFFFull" or tokens[2] == "0xFFFFFFFFu":
                    h = "0xFFFFFFFF"


                enum2hex[e] = h
                
                if h not in hex2enum.keys():
                    hex2enum[h] = [e]
                else:
                    hex2enum[h].append(e)



    with open("gl_enum_string_helper.h", "w") as outfile:
        print(header, file=outfile)
        print("static inline const char* string_gl_enum(GLenum input_value) {", file=outfile)
        print("    switch (input_value) {", file=outfile)

        for el in hex2enum.values():
            # print('GL_ENUM(%s,%s)' % (enum, enums[enum]), file=outfile)
            print("        case %s:" % el[0], file=outfile)
            
            res = '|'.join(el)
            print("            return \"%s\";" % res, file=outfile)
        
        print("        default:", file=outfile)
        print("            return \"Unhandled Enum\";", file=outfile)
        print("    }", file=outfile)
        print("}", file=outfile)


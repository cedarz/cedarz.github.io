#include <vector>
#include <string>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <iostream>
#define M_PI       3.14159265358979323846   // pi

std::string vertShader = R"(
#version 460

layout(std430, binding = 0) buffer TVertex
{
   vec4 vertex[]; 
};

uniform mat4  u_mvp;
uniform vec2  u_resolution;
uniform float u_thickness;

void main()
{
    int line_i = gl_VertexID / 6;
    int tri_i  = gl_VertexID % 6;

    vec4 va[4];
    for (int i=0; i<4; ++i)
    {
        va[i] = u_mvp * vertex[line_i+i];
        va[i].xyz /= va[i].w;
        va[i].xy = (va[i].xy + 1.0) * 0.5 * u_resolution;
    }

    vec2 v_line  = normalize(va[2].xy - va[1].xy);
    vec2 nv_line = vec2(-v_line.y, v_line.x);

    vec4 pos;
    if (tri_i == 0 || tri_i == 1 || tri_i == 3)
    {
        vec2 v_pred  = normalize(va[1].xy - va[0].xy);
        vec2 v_miter = normalize(nv_line + vec2(-v_pred.y, v_pred.x));

        pos = va[1];
        pos.xy += v_miter * u_thickness * (tri_i == 1 ? -0.5 : 0.5) / dot(v_miter, nv_line);
    }
    else
    {
        vec2 v_succ  = normalize(va[3].xy - va[2].xy);
        vec2 v_miter = normalize(nv_line + vec2(-v_succ.y, v_succ.x));

        pos = va[2];
        pos.xy += v_miter * u_thickness * (tri_i == 5 ? 0.5 : -0.5) / dot(v_miter, nv_line);
    }

    pos.xy = pos.xy / u_resolution * 2.0 - 1.0;
    pos.xyz *= pos.w;
    gl_Position = pos;
}
)";

std::string fragShader = R"(
#version 460

out vec4 fragColor;

void main()
{
    fragColor = vec4(1.0);
}
)";

void checkCompileErrors(GLuint shader, std::string type)
    {
        GLint success;
        GLchar infoLog[1024];
        if (type != "PROGRAM")
        {
            glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
            if (!success)
            {
                glGetShaderInfoLog(shader, 1024, NULL, infoLog);
                std::cout << "ERROR::SHADER_COMPILATION_ERROR of type: " << type << "\n" << infoLog << "\n -- --------------------------------------------------- -- " << std::endl;
            }
        }
        else
        {
            glGetProgramiv(shader, GL_LINK_STATUS, &success);
            if (!success)
            {
                glGetProgramInfoLog(shader, 1024, NULL, infoLog);
                std::cout << "ERROR::PROGRAM_LINKING_ERROR of type: " << type << "\n" << infoLog << "\n -- --------------------------------------------------- -- " << std::endl;
            }
        }
    }

GLuint CreateProgram(const std::string& vertexCode, const std::string& fragmentCode)
{

    const char* vShaderCode = vertexCode.c_str();
    const char* fShaderCode = fragmentCode.c_str();
    // 2. compile shaders
    unsigned int vertex, fragment;
    // vertex shader
    vertex = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertex, 1, &vShaderCode, NULL);
    glCompileShader(vertex);
    checkCompileErrors(vertex, "VERTEX");
    // fragment Shader
    fragment = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragment, 1, &fShaderCode, NULL);
    glCompileShader(fragment);
    checkCompileErrors(fragment, "FRAGMENT");
    // shader Program
    GLuint ID = glCreateProgram();
    glAttachShader(ID, vertex);
    glAttachShader(ID, fragment);
    glLinkProgram(ID);
    checkCompileErrors(ID, "PROGRAM");
    // delete the shaders as they're linked into our program now and no longer necessary
    glDeleteShader(vertex);
    glDeleteShader(fragment);

    return ID;
}

GLuint CreateSSBO(std::vector<glm::vec4> &varray)
{
    GLuint ssbo;
    glGenBuffers(1, &ssbo);
    glBindBuffer(GL_SHADER_STORAGE_BUFFER, ssbo );
    glBufferData(GL_SHADER_STORAGE_BUFFER, varray.size()*sizeof(*varray.data()), varray.data(), GL_STATIC_DRAW); 
    return ssbo;
}

int main(void)
{
    if ( glfwInit() == 0 )
        return 0;

    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, 1);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    GLFWwindow *window = glfwCreateWindow( 800, 600, "GLFW OGL window", nullptr, nullptr );
    if ( window == nullptr )
    {
        glfwTerminate();
        return 0;
    }
    glfwMakeContextCurrent(window);
    // glad: load all OpenGL function pointers
    // ---------------------------------------
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        std::cout << "Failed to initialize GLAD" << std::endl;
        return -1;
    }

    std::cout << " Vendor: " << glGetString(GL_VENDOR) << std::endl;
    std::cout << " Render: " << glGetString(GL_RENDERER) << std::endl;
    std::cout << "     GL: " << glGetString(GL_VERSION) << std::endl;
    std::cout << "   GLSL: " << glGetString(GL_SHADING_LANGUAGE_VERSION) << std::endl;
    GLint profile;
    glGetIntegerv(GL_CONTEXT_PROFILE_MASK, &profile);
    std::cout << "Profile: " << (profile & GL_CONTEXT_CORE_PROFILE_BIT ? "Core" : "Compatibility") << std::endl;

      int num_ext;
      glGetIntegerv(GL_NUM_EXTENSIONS, &num_ext);
      int NumberOfTextureUnits = 0;
      glGetIntegerv(GL_MAX_TEXTURE_IMAGE_UNITS, &NumberOfTextureUnits);
      for (int i = 0; i < num_ext; i++)
      {
        if (!strcmp((const char*)glGetStringi(GL_EXTENSIONS, i), "GL_ARB_compatibility"))
        {
          printf("Compatiblity Profile\n");
        }
      }

    GLuint program  = CreateProgram(vertShader, fragShader);
    GLint  loc_mvp  = glGetUniformLocation(program, "u_mvp");
    GLint  loc_res  = glGetUniformLocation(program, "u_resolution");
    GLint  loc_thi  = glGetUniformLocation(program, "u_thickness");

    glUseProgram(program);
    glUniform1f(loc_thi, 20.0);

    GLushort pattern = 0x18ff;
    GLfloat  factor  = 2.0f;

    glm::vec4 p0(-1.0f, -1.0f, 0.0f, 1.0f);
    glm::vec4 p1(1.0f, -1.0f, 0.0f, 1.0f);
    glm::vec4 p2(1.0f, 1.0f, 0.0f, 1.0f);
    glm::vec4 p3(-1.0f, 1.0f, 0.0f, 1.0f);
    std::vector<glm::vec4> varray1{ p3, p0, p1, p2, p3, p0 };
    GLuint ssbo1 = CreateSSBO(varray1);

    std::vector<glm::vec4> varray2;
    for (int u=-8; u <= 368; u += 8)
    {
        double a = u*M_PI/180.0;
        double c = cos(a), s = sin(a);
        varray2.emplace_back(glm::vec4((float)c, (float)s, 0.0f, 1.0f));
    }
    GLuint ssbo2 = CreateSSBO(varray2);

    GLuint vao;
    glGenVertexArrays(1, &vao);
    glBindVertexArray(vao);

    glClearColor(0.0f, 0.0f, 0.0f, 0.0f);
    glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);

    glm::mat4(project);
    int vpSize[2]{0, 0};
    while (!glfwWindowShouldClose(window))
    {
        double t = glfwGetTime();
        int w, h;
        glfwGetFramebufferSize(window, &w, &h);
        if (w != vpSize[0] ||  h != vpSize[1])
        {
            vpSize[0] = w; vpSize[1] = h;
            glViewport(0, 0, vpSize[0], vpSize[1]);
            float aspect = (float)w/(float)h;
            project = glm::ortho(-aspect, aspect, -1.0f, 1.0f, -10.0f, 10.0f);
            glUniform2f(loc_res, (float)w, (float)h);
        }

        glClear(GL_COLOR_BUFFER_BIT);
        glLineWidth(5.0);

        glm::mat4 modelview1( 1.0f );
        modelview1 = glm::translate(modelview1, glm::vec3(-0.6f, 0.0f, 0.0f) );
        modelview1 = glm::scale(modelview1, glm::vec3(0.5f, 0.5f, 1.0f) );
        glm::mat4 mvp1 = project * modelview1;

        glUniformMatrix4fv(loc_mvp, 1, GL_FALSE, glm::value_ptr(mvp1));
        glBindBufferBase(GL_SHADER_STORAGE_BUFFER, 0, ssbo1);
        GLsizei N1 = (GLsizei)varray1.size()-2;
        glDrawArrays(GL_TRIANGLES, 0, 6*(N1-1));

        glm::mat4 modelview2( 1.0f );
        modelview2 = glm::translate(modelview2, glm::vec3(0.6f, 0.0f, 0.0f) );

        //std::cout << t << std::endl;
        modelview2 = glm::rotate(modelview2, /*float(t)*/glm::radians(-87.0f), glm::vec3(1.0f, 0.0f, 0.0f));
        modelview2 = glm::scale(modelview2, glm::vec3(0.5f, 0.5f, 1.0f) );
        glm::mat4 mvp2 = project * modelview2;

        glUniformMatrix4fv(loc_mvp, 1, GL_FALSE, glm::value_ptr(mvp2));
        glBindBufferBase(GL_SHADER_STORAGE_BUFFER, 0, ssbo2);
        GLsizei N2 = (GLsizei)varray2.size()-2;
        // glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
        glDrawArrays(GL_TRIANGLES, 0, 6*(N2-1));

        glfwSwapBuffers(window);
        glfwPollEvents();
    }
    glfwTerminate();

    return 0;
}